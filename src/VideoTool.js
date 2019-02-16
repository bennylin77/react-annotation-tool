import React, { Component } from 'react';
import {normalize, denormalize, schema} from 'normalizr';
import {Container, Button, ButtonGroup} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

import {MdRedo, MdUndo, MdAdd} from 'react-icons/md';
import {colors, getRandomInt, interpolationArea, interpolationPosition} from './helper.js';
import Player from './components/videoTool/Player';
import PlayerControl from './components/videoTool/PlayerControl';
import Canvas from './components/videoTool/Canvas';
import List from './components/videoTool/List';
import Review from './components/videoTool/Review';
import Preview from './components/videoTool/Preview';
import {SPLIT, HIDE, SHOW} from './models/2DVideo.js';
import {VideoAnnotation, Trajectory} from 'models/2DVideo.js';
import {UndoRedo} from 'models/UndoRedo.js';

class VideoTool extends Component {
  constructor(props) {
    super(props);
		const entities = {annotations:{}}
		let annotations = []
		if(props.annotations && props.annotations.length!==0){
			const annotation = new schema.Entity('annotations')
			const normalizedAnn = normalize(props.annotations, [annotation])
			entities.annotations = normalizedAnn.entities.annotations
			annotations = normalizedAnn.result
		}
		this.state = { previewed: !props.previewNotices, submitted: false, annotationWidth: props.annotationWidth || 400, annotationHeight: 200, entities: entities, annotations: annotations,
							 		 played: 0, playing: false, playbackRate: 1, duration: 0, loop: false, seeking: false, adding: false, focusing: "",
								   trajectoryCollapses: {} };
		this.UndoRedoState = new UndoRedo();
  }

	componentDidUpdate(prevProps) {}
	/* ==================== utilities ==================== */
	getLastLabel = () =>{
		const {annotations, entities} = this.state;
		let i = 1;
		while(i <= annotations.length){
			const ann = annotations.find( ann=> entities.annotations[ann].label === `${i}` )
			if(!ann)
				return i;
			i++;
		}
		return i;
	}
	/* ==================== video player ==================== */
	playerRef = player => {
		this.player = player
	}
	handleVideoReady = () =>{
		this.setState({annotationHeight: document.getElementById('react-player').children[0].clientHeight})
	}
	handleVideoProgress = state => {
		const played = state.played
		this.setState((prevState, props) => {
			if (prevState.seeking)
				return;
			return { played: played }
		})
  }
	handleVideoDuration = duration => {
    this.setState({ duration })
  }
	handleVideoEnded = () => {
    this.setState({ playing: this.state.loop })
  }

	/* ==================== video player control ==================== */
	handlePlayerControlVideoRewind = () => {
		this.setState({ playing: false, played: 0 })
		this.player.seekTo(0)
	}
	handlePlayerControlVideoPlayPause = () => {
		this.setState({ playing: !this.state.playing })
	}
	handlePlayerControlVideoSpeedChange = s =>{
		this.setState({ playbackRate: s })
	}
	handlePlayerControlSliderMouseUp = e => {
		this.setState({ seeking: false })
	}
	handlePlayerControlSliderMouseDown = e => {
		this.setState({playing: false, seeking: true})
	}
	handlePlayerControlSliderChange = e => {
		const played = parseFloat(e.target.value);
		this.setState((prevState, props) => {
			const {entities} = prevState
			let {focusing} = prevState
			if(focusing){
				const trajectories = entities.annotations[focusing].trajectories
				for( let i = 0; i < trajectories.length; i++){
					if(played >= trajectories[i].time){
						if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
							continue;
						if(trajectories[i].status!==SHOW)
							focusing = "";
						break;
					}else{
						if(i==trajectories.length-1)
							focusing = "";
					}
				}
			}
			return { played: played, focusing: focusing }
		}, ()=>{this.player.seekTo(played)})
	}
	/* ==================== canvas ==================== */
	handleAddClick = () =>{
		this.setState((prevState, props) => {
			return {adding: !prevState.adding, playing: false};
		});
	}
	handleCanvasStageMouseMove = e =>{}
	handleCanvasStageMouseDown = e =>{
		if(!this.state.adding)
			return;
		const stage = e.target.getStage()
		const position = stage.getPointerPosition()
		const timeNow = new Date().getTime().toString(36);
		const color = colors[getRandomInt(colors.length)]
		this.setState((prevState, props) => {
			this.UndoRedoState.save({...prevState, adding: false}); // Undo/Redo
			const {adding, focusing, annotations, entities, trajectoryCollapses} = prevState;
			const trajectories = []
			//console.log(this.getLastLabel());
			trajectories.push( new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: position.x, y: position.y, height: 1, width: 1, time: prevState.played}) )
			entities.annotations[`${timeNow}`] = new VideoAnnotation({id: `${timeNow}`, name: `${timeNow}`, label: `${this.getLastLabel()}`, color: color, trajectories: trajectories})
			//this.counter++;
			//handle trajectory collapses
			trajectoryCollapses[`${timeNow}`] = false;
			return { adding: !prevState.adding,
							 focusing: `${timeNow}`,
							 annotations: [...annotations, `${timeNow}`],
							 entities: {...entities, ["annotations"]: entities.annotations},
						   trajectoryCollapses: trajectoryCollapses}
		}, () => {
			const group = stage.find(`.${timeNow}`)[0]
			const bottomRight = group.get('.bottomRight')[0]
			bottomRight.startDrag();
		});
	}
	handleCanvasStageMouseUp = e => {}
	handleCanvasGroupMouseDown = e =>{
		const group = e.target.findAncestor('Group')
		this.setState({playing: false, focusing: group.name()});
	}
	handleCanvasGroupDragStart = e =>{}

	handleCanvasGroupDragMove = e =>{
		if(e.target.getClassName() !== 'Group')
			return;
		const group = e.target
		const rect = group.get('Rect')[0];
		const topLeft = group.get('.topLeft')[0]
		//const position = topLeft.getAbsolutePosition()
		const position = group.position()
		const timeNow = new Date().getTime().toString(36);
		//console.log(position)
		const x = position.x<0 ? 0 : position.x;
		const y = position.y<0 ? 0 : position.y;

		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState)
			const {entities, played} = prevState;
			const annotations = entities.annotations;
			let trajectories = entities.annotations[group.name()].trajectories;
			for( let i = 0; i < trajectories.length; i++){
				if(played >= trajectories[i].time){
					//skip elapsed trajectories
					if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
						continue;
					if(played===trajectories[i].time){
						trajectories[i].x = x; trajectories[i].y = y; trajectories[i].width = rect.width(); trajectories[i].height = rect.height();
						break;
					}
					if(i===trajectories.length-1){
						trajectories.push(new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: x, y: y, width: rect.width(), height: rect.height(), time: played}));
						break;
					}
					trajectories.splice(i+1, 0, new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: x, y: y, height: rect.height(), width: rect.width(), time: played}));
					break;
				}
			}
			return {}
		})
	}

	handleCanvasGroupDragEnd = e =>{
		if(e.target.getClassName() !== 'Group')
			return;
		const group = e.target
		const rect = group.get('Rect')[0];
		const topLeft = group.get('.topLeft')[0]
		const position = group.position()

		const timeNow = new Date().getTime().toString(36);
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState)
			const {entities, played} = prevState;
			const annotations = entities.annotations;
			let trajectories = entities.annotations[group.name()].trajectories;
			for( let i = 0; i < trajectories.length; i++){
				if(played >= trajectories[i].time){
					//skip elapsed trajectories
					if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
						continue;
					if(played===trajectories[i].time){
						trajectories[i].x = position.x; trajectories[i].y = position.y; trajectories[i].width = rect.width(); trajectories[i].height = rect.height();
						break;
					}
					if(i===trajectories.length-1){
						trajectories.push(new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: position.x, y: position.y, width: rect.width(), height: rect.height(), time: played}));
						break;
					}
					trajectories.splice(i+1, 0, new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: position.x, y: position.y, height: rect.height(), width: rect.width(), time: played}));
					break;
				}
			}
			return {}
			//return { entities: {...entities, ['annotations']: ...annotations }}
		})
	}
	handleCanvasDotMouseDown = e =>{
		const group = e.target.findAncestor('Group')
		this.setState({focusing: group.name()})
	}
	handleCanvasDotDragMove = e =>{}
	handleCanvasDotDragEnd = e =>{
		const activeAnchor = e.target
		const group = activeAnchor.getParent();
		const timeNow = new Date().getTime().toString(36);
		group.draggable(true)
		const topLeft = group.get('.topLeft')[0], topRight = group.get('.topRight')[0], bottomRight = group.get('.bottomRight')[0], bottomLeft = group.get('.bottomLeft')[0];
		const maxX = Math.max(topLeft.getAbsolutePosition().x, topRight.getAbsolutePosition().x, bottomRight.getAbsolutePosition().x, bottomLeft.getAbsolutePosition().x)
		const minX = Math.min(topLeft.getAbsolutePosition().x, topRight.getAbsolutePosition().x, bottomRight.getAbsolutePosition().x, bottomLeft.getAbsolutePosition().x)
		const maxY = Math.max(topLeft.getAbsolutePosition().y, topRight.getAbsolutePosition().y, bottomRight.getAbsolutePosition().y, bottomLeft.getAbsolutePosition().y)
		const minY = Math.min(topLeft.getAbsolutePosition().y, topRight.getAbsolutePosition().y, bottomRight.getAbsolutePosition().y, bottomLeft.getAbsolutePosition().y)
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState)
			const {entities, played} = prevState;
			const annotations = entities.annotations;
			let trajectories = entities.annotations[group.name()].trajectories;
			for( let i = 0; i < trajectories.length; i++){
					if(played >= trajectories[i].time){
						//skip elapsed trajectories
						if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
							continue;
						if(played===trajectories[i].time){
							trajectories[i].x = minX; trajectories[i].y = minY; trajectories[i].height = maxY-minY; trajectories[i].width = maxX-minX;
							break;
						}
						trajectories.splice( i+1, 0, new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: minX, y: minY, height: maxY-minY, width: maxX-minX, time: played}))
						break;
					}
			}
			//console.log(`====save====`)
			//console.log(`x ${minX}, y ${minY}`)
			//console.log(`width ${maxX-minX}, height ${maxY-minY}`)

			annotations[group.name()].trajectories = trajectories;
			return { entities: {...entities, ['annotations']: annotations}}
		})
	}
	/* ==================== list ==================== */
	handleListAnnotationClick = name =>{
		this.setState({focusing: name})
	}
	handleListTrajectoryJump = e => {
		const name = e.name
		const time = e.time
		this.setState({ playing: false, focusing: name },
			() => {this.player.seekTo(parseFloat(time))})
	}

	handleListTrajectoryToggle = e =>{
		this.setState((prevState, props) => {
			const {trajectoryCollapses} = prevState
			trajectoryCollapses[e] = !trajectoryCollapses[e]
			return {trajectoryCollapses: trajectoryCollapses}
		})
	}

	handleListTrajectoryDelete = e => {
		const annotationName = e.annotationName
		const trajectoryName = e.trajectoryName
		this.setState( prevState => {
			this.UndoRedoState.save(prevState)
			const {entities} = prevState
			const annotations = entities.annotations;
			const trajectories = entities.annotations[annotationName].trajectories.filter( t => {
					if(t.name !== trajectoryName)
						return true;
					return false
		  });
			annotations[annotationName].trajectories = trajectories;
			return { entities: {...entities, ['annotations']: annotations}}
		});
	}


	handleListAnnotationDelete = name => {
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState)
			const {entities, annotations} = prevState
			const entitiesAnnotations = entities.annotations
			const label = entitiesAnnotations[name].label
			//reorder the list
			if(!isNaN(label)){
				const lastLabel = this.getLastLabel()-1;
				if(`${lastLabel}`!=='1' && `${lastLabel}` !== label){
					const lastName = annotations.find( a =>{
						return entitiesAnnotations[a].label === `${lastLabel}`;
					})
					//console.log(lastName)
					this.renameLabel(annotations, entitiesAnnotations, lastName, label)
					//console.log(lastLabel);
				}
			}
			//remove name from the parent's children
			if(entitiesAnnotations[name].parent){
				const parent = entitiesAnnotations[entitiesAnnotations[name].parent];
				const i = parent.children.indexOf(name);
				if(i!==-1){
					parent.children.splice(i, 1);
					if(parent.children.length==0 && parent.trajectories[parent.trajectories.length-1].status===SPLIT)
						parent.trajectories[parent.trajectories.length-1].status = SHOW
				}
			}
			//remove all its children and itself recusively
			this.removeAnnotation(annotations, entitiesAnnotations, name);




			return { annotations: annotations, entities: {...entities, ["annotations"]: entitiesAnnotations}, focusing: "" };
		});
	}
	removeAnnotation = (annotations, entitiesAnnotations, name) =>{
		//console.log(name)
		//console.log(JSON.stringify(entitiesAnnotations[name]))
		if(entitiesAnnotations[name].children.length!==0){
			//console.log(JSON.stringify(entitiesAnnotations[name].children))
			entitiesAnnotations[name].children.forEach(c=>{
				//console.log("children")
				//console.log(c)
				this.removeAnnotation(annotations, entitiesAnnotations, c);
			})
		}

		/*
		const deletedLabel = entitiesAnnotations[name].label;
		if(annotations.length !== deletedLabel){
			annotations.forEach(a=>{
				if(entitiesAnnotations[a].label===annotations.length){
					entitiesAnnotations[a].label = deletedLabel
				}
			})
		}
		*/
		delete entitiesAnnotations[name];
		const i =  annotations.indexOf(name);
		annotations.splice( i, 1);
	}
	renameLabel = (annotations, entitiesAnnotations, name, label) => {
		if(entitiesAnnotations[name].children.length!==0){
			entitiesAnnotations[name].children.forEach( (c, index )=>{
				this.renameLabel(annotations, entitiesAnnotations, c, `${label}-${index+1}`);
			});

		}
		entitiesAnnotations[name].label = label;
	}

	handleListAnnotationShowHide = e => {
		const name = e.name;
		const status = e.status;
		const timeNow = new Date().getTime().toString(36);
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState)
			const {played, entities} = prevState
			let trajectories = entities.annotations[name].trajectories;
			for( let i = 0; i < trajectories.length; i++){
				if(i===0 && played < trajectories[i].time){
					trajectories.splice(0, 0, new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: trajectories[i].x, y: trajectories[i].y, height: trajectories[i].height, width: trajectories[i].width, time: played, status: status}));
					break;
				}
				if(played >= trajectories[i].time){
					//skip elapsed trajectories
					if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
						continue;
					if(played===trajectories[i].time){
						trajectories.splice(i, 1, new Trajectory({...trajectories[i], id: `${timeNow}`, name: `${timeNow}`,status: status}));
						break;
					}
					if(i===trajectories.length-1){
						trajectories.push(new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: trajectories[i].x, y: trajectories[i].y, height: trajectories[i].height, width: trajectories[i].width, time: played, status: status}));
						break;
					}
					let interpoArea = interpolationArea( { startTraj: trajectories[i], endTraj: trajectories[i+1], played: played })
					let interpoPos = interpolationPosition( { startTraj: trajectories[i], endTraj: trajectories[i+1], played: played })
					trajectories.splice(i+1, 0, new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: interpoPos.x, y: interpoPos.y, height: interpoArea.height, width: interpoArea.width, time: played, status: status}));
					break;
				}
			}
			if(status === HIDE )
				Trajectory.clearRedundantTrajectories(trajectories, status);
			return { entities: {...entities, ['annotations']: entities.annotations}}
		})
	}



	handleListAnnotationSplit = name =>{
		const timeNow = (new Date()).getTime().toString(36);
		const timeNowChild1 = ((new Date()).getTime()+1).toString(36);
		const timeNowChild2 = ((new Date()).getTime()+2).toString(36);
		const status = SPLIT;
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState)
			const {played, entities, annotations} = prevState
			const parent = entities.annotations[name]
			//remove ex-children
			if(parent.children.length!==0){
				for(const c of parent.children){
					delete entities.annotations[c];
					const i =  annotations.indexOf(c);
					annotations.splice( i, 1);
				}
			}
			//make sure parent's color is different from its children
			let randomColor = colors[getRandomInt(colors.length)];
			while(parent.color === randomColor)
				randomColor = colors[getRandomInt(colors.length)];
			const childrenColor = randomColor;

			let parentX, parentY, parentWidth, parentHeight;
			let trajectories = parent.trajectories
			for( let i = 0; i < trajectories.length; i++){
				if(played >= trajectories[i].time){
					if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
						continue;
					parentX = trajectories[i].x;
					parentY = trajectories[i].y;
					parentWidth = trajectories[i].width;
					parentHeight = trajectories[i].height;
					if(played===trajectories[i].time){
						trajectories.splice(i, 1, new Trajectory({...trajectories[i], id: `${timeNow}`, name: `${timeNow}`, status: status}));
						trajectories = trajectories.slice(0,i+1);
						break;
					}
					if(i===trajectories.length-1){
						trajectories.push(new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: trajectories[i].x, y: trajectories[i].y, height: trajectories[i].height, width: trajectories[i].width, time: played, status: status}));
						break;
					}
					let interpoArea = interpolationArea( { startTraj: trajectories[i], endTraj: trajectories[i+1], played: played })
					let interpoPos = interpolationPosition( { startTraj: trajectories[i], endTraj: trajectories[i+1], played: played })
					parentX = interpoPos.x;
					parentY = interpoPos.y;
					parentWidth = interpoArea.width;
					parentHeight = interpoArea.height;
					trajectories.splice(i+1, 0, new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: interpoPos.x, y: interpoPos.y, height: interpoArea.height, width: interpoArea.width, time: played, status: status}));
					trajectories = trajectories.slice(0,i+2);
					break;
				}
			}
			parent.children = [`${timeNowChild1}`, `${timeNowChild2}`];
			parent.trajectories = trajectories;
			const childTrajectories1 = [new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: parentX, y: parentY, height: parentHeight/2, width: parentWidth/2, time: played})]
			const childTrajectories2 = [new Trajectory({id: `${timeNow}`, name: `${timeNow}`, x: parentX+parentWidth/2-20, y: parentY+parentHeight/2-20, height: parentHeight/2, width: parentWidth/2, time: played})];
			entities.annotations[`${timeNowChild1}`] = new VideoAnnotation({id: `${timeNowChild1}`, name: `${timeNowChild1}`, label: `${parent.label}-1`, color: childrenColor, trajectories: childTrajectories1, parent: parent.name })
			entities.annotations[`${timeNowChild2}`] = new VideoAnnotation({id: `${timeNowChild2}`, name: `${timeNowChild2}`, label: `${parent.label}-2`, color: childrenColor, trajectories: childTrajectories2, parent: parent.name })
			const parentIndex = annotations.find(a => a===parent.name )
			annotations.splice(parentIndex, 0, `${timeNowChild1}`);
			annotations.splice(parentIndex, 0, `${timeNowChild2}`);
			return { annotations: annotations, entities: entities, focusing: `${timeNowChild2}`};
		})
	}
	handleListVideoPause = () =>{
		this.setState({ playing: false })
	}
	/* ==================== undo/redo ==================== */
	handleUndo = () =>{
		if(this.UndoRedoState.previous.length===0)
			return;
		this.setState((prevState, props) => {
			const state = this.UndoRedoState.undo(prevState);
			return {...state};
		})
	}
	handleRedo = () =>{
		if(this.UndoRedoState.next.length===0)
			return;
		this.setState((prevState, props) => {
			const state = this.UndoRedoState.redo(prevState);
			return {...state};
		})
	}
	/* ==================== preview ================ */
	handlePreviewed = () =>{
		this.setState({previewed: true})
	}
	/* ==================== review ==================== */
	handleReviewCancelSubmission = () =>{
		this.setState({loop: false, submitted: false, playing: false})
	}
	/* ==================== submit ==================== */
	handleSubmit = () =>{
		if(!this.state.submitted && this.props.review){
			this.setState({loop: true, submitted: true, played: 0, playing: true, focusing: ""})
			return;
		}
		const { annotationWidth, annotationHeight, annotations, entities } = this.state
		const { url } = this.props
		const annotation = new schema.Entity('annotations')
		const denormalizedAnnotations = denormalize({ annotations: annotations }, {annotations: [annotation]}, entities).annotations;
		const data = {url: url, annotationWidth: annotationWidth, annotationHeight: annotationHeight, annotations: denormalizedAnnotations}
		this.props.onSubmit(data);
	}



  render() {
		const { previewed,	submitted, annotationWidth, annotationHeight, playing, played, playbackRate, duration, loop, adding, focusing,
		 				entities, annotations, trajectoryCollapses} = this.state;
    const { url, previewNotices } = this.props
		//const playbackRate = this.props.playbackRate || 1;
		//let panelHeight = annotationHeight<=MAX_PANEL_HEIGHT? annotationHeight:MAX_PANEL_HEIGHT;
		let panelContent;
		if(submitted)
			panelContent = <Review height={annotationHeight} onConfirmSubmission={this.handleSubmit} onCancelSubmission={this.handleReviewCancelSubmission} />
		else if(previewed)
			panelContent = (<div>
											<div className="pb-3 clearfix" style={{minWidth: "400px"}}>
												<Button disabled={adding} color="primary" size ="lg" onClick={this.handleAddClick} className="d-flex align-items-center float-left"><MdAdd/> {adding ? 'Adding a New Box' : 'Add a New Box'}</Button>
												<ButtonGroup className="float-right">
													<Button disabled={this.UndoRedoState.previous.length==0} outline onClick={this.handleUndo}><MdUndo/></Button>
													<Button disabled={this.UndoRedoState.next.length==0} outline onClick={this.handleRedo}><MdRedo/></Button>
												</ButtonGroup>
											</div>
											<List entities={entities}
													  annotations={annotations}
													  duration={duration}
													  played={played}
													  focusing={focusing}
													  height={annotationHeight}
													  trajectoryCollapses = {trajectoryCollapses}
													  onListVideoPause = {this.handleListVideoPause}
													  onListAnnotationClick = {this.handleListAnnotationClick}
													  onListAnnotationDelete= {this.handleListAnnotationDelete}
													  onListAnnotationShowHide={this.handleListAnnotationShowHide}
													  onListAnnotationSplit={this.handleListAnnotationSplit}
													  onListTrajectoryJump={this.handleListTrajectoryJump}
													  onListTrajectoryDelete={this.handleListTrajectoryDelete}
													  onListTrajectoryToggle={this.handleListTrajectoryToggle}
											  />
											</div>)
		else {
			panelContent = <Preview height={annotationHeight} notices={previewNotices} onPreviewed={this.handlePreviewed} />
		}

    return (
			<div>
				<div className="d-flex flex-wrap justify-content-around py-3" style={{background: "rgb(246, 246, 246)"}}>
					<div className="mb-3" style={{width: annotationWidth}}>
						<div style={{position: 'relative'}}>
							<Player playerRef={this.playerRef}
											onVideoReady={this.handleVideoReady}
											onVideoProgress={this.handleVideoProgress}
											onVideoDuration={this.handleVideoDuration}
											onVideoEnded={this.handleVideoEnded }
											url={url}
											width={annotationWidth}
											playing={playing}
											loop={loop}
											playbackRate={playbackRate}
											/>
							<Canvas width = {annotationWidth}
											height = {annotationHeight}
											played = {played}
											focusing = {focusing}
											adding = {adding}
											entities={entities}
											annotations={annotations}
											onCanvasStageMouseMove={this.handleCanvasStageMouseMove}
											onCanvasStageMouseDown={this.handleCanvasStageMouseDown}
											onCanvasStageMouseUp={this.handleCanvasStageMouseUp}
											onCanvasGroupMouseDown={this.handleCanvasGroupMouseDown}
											onCanvasGroupDragStart={this.handleCanvasGroupDragStart}
											onCanvasGroupDragEnd={this.handleCanvasGroupDragEnd}
											onCanvasGroupDragMove={this.handleCanvasGroupDragMove}
											onCanvasDotMouseDown={this.handleCanvasDotMouseDown}
											onCanvasDotDragMove={this.handleCanvasDotDragMove}
											onCanvasDotDragEnd={this.handleCanvasDotDragEnd}
											/>
						</div>
						<PlayerControl playing={playing}
													 played={played}
													 playbackRate={playbackRate}
													 duration={duration}
													 onPlayerControlSliderMouseUp={this.handlePlayerControlSliderMouseUp}
													 onPlayerControlSliderMouseDown={this.handlePlayerControlSliderMouseDown}
													 onPlayerControlSliderChange={this.handlePlayerControlSliderChange}
													 onPlayerControlVideoRewind={this.handlePlayerControlVideoRewind}
													 onPlayerControlVideoPlayPause={this.handlePlayerControlVideoPlayPause}
													 onPlayerControlVideoSpeedChange={this.handlePlayerControlVideoSpeedChange}
						/>
					</div>
					<div className="mb-3">
						{panelContent}
					</div>
				</div>
				<div className="d-flex justify-content-center pt-3">
					{submitted || !previewed ? "":(<div><Button onClick={this.handleSubmit}>Submit</Button></div>)}
				</div>
			</div>
    );
  }
}
export default VideoTool;

/*onCanvasStageRef={this.handleCanvasStageRef}*/
