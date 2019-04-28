import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { normalize, denormalize, schema } from 'normalizr';
import { Button, ButtonGroup } from 'reactstrap';
import { MdRedo, MdUndo, MdAdd } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.css';
import PopupDialog from 'shared/components/PopupDialog/PopupDialog';
import { highContrastingColors as colors } from 'shared/utils/colorUtils';
import { getRandomInt } from 'shared/utils/mathUtils';
import { SPLIT, HIDE, SHOW } from 'models/2DVideo.js';
import { VideoAnnotation, Trajectory } from 'models/2DVideo.js';
import { UndoRedo } from 'models/UndoRedo.js';
import { getInterpolatedData, INTERPOLATION_TYPE } from '../../utils/interpolationUtils';

import { interpolationArea, interpolationPosition } from '../Tmp/helper.js';


import VideoPlayerScreen from '../VideoPlayer/Screen/Screen.jsx';
import VideoPlayerControl from '../VideoPlayer/Control/Control.jsx';
import Preview from '../Preview/Preview.jsx';
import Review from '../Review/Review.jsx';
import Canvas from '../Canvas/Canvas.jsx';


import List from '../Tmp/List';


class TwoDimensionalVideo extends Component {
	constructor(props) {
		super(props);
		const entities = { annotations: {} };
		let annotations = [];
		if (props.annotations && props.annotations.length !== 0) {
			const annotation = new schema.Entity('annotations');
			const normalizedAnn = normalize(props.annotations, [annotation]);
			entities.annotations = normalizedAnn.entities.annotations;
			annotations = normalizedAnn.result;
			annotations.forEach((id) => {
				entities.annotations[id].isManipulatable = props.defaultAnnotationsManipulatable;
			});
		}


		this.state = {
			previewed: !props.previewNotices && !props.previewHead,
			submitted: false,
			annotationWidth: props.annotationWidth || 400,
			annotationHeight: 200,
			entities,
			annotations,
			played: 0,
			playing: false,
			playbackRate: 1,
			duration: 0,
			loop: false,
			seeking: false,
			adding: false,
			focusing: '',
			trajectoryCollapses: {},
			dialogIsOpen: false,
			dialogTitle: '',
			dialogMessage: '',
			defaultNumberOfAnnotations: annotations.length,
			defaultNumberOfParentAnnotations: this.getLastLabel(annotations, entities),
		};
		this.UndoRedoState = new UndoRedo();
	}

	componentDidUpdate(prevProps) {}

	/* ==================== utilities ==================== */
	getLastLabel = (annotations, entities) => {
		let i = 1;
		while (i <= annotations.length) {
			const ann = annotations.find(ann => entities.annotations[ann].label === `${i}`);
			if (!ann) return i;
			i++;
		}
		return i;
	}

	/* ==================== video player ==================== */
	handlePlayerRef = (player) => {
		this.player = player;
	}

	handleVideoReady = () => {
		this.setState({ annotationHeight: document.getElementById('react-player').children[0].clientHeight });
	}

	handleVideoProgress = (state) => {
		const { played } = state;
		this.setState((prevState, props) => {
			if (prevState.seeking) return;
			return { played };
		});
	}

	handleVideoDuration = (duration) => {
		this.setState({ duration });
	}

	handleVideoEnded = () => {
		this.setState({ playing: this.state.loop });
	}

	/* ==================== video player control ==================== */
	handlePlayerControlVideoRewind = () => {
		this.setState({ playing: false, played: 0 });
		this.player.seekTo(0);
	}

	handlePlayerControlVideoPlayPause = () => {
		this.setState({ playing: !this.state.playing });
	}

	handlePlayerControlVideoSpeedChange = (s) => {
		this.setState({ playbackRate: s });
	}

	handlePlayerControlSliderMouseUp = (e) => {
		this.setState({ seeking: false });
	}

	handlePlayerControlSliderMouseDown = (e) => {
		this.setState({ playing: false, seeking: true });
	}

	handlePlayerControlSliderChange = (e) => {
		const played = parseFloat(e.target.value);
		this.setState((prevState, props) => {
			const { entities } = prevState;
			let { focusing } = prevState;
			if (focusing) {
				const { trajectories } = entities.annotations[focusing];
				for (let i = 0; i < trajectories.length; i++) {
					if (played >= trajectories[i].time) {
						if (i !== trajectories.length - 1 && played >= trajectories[i + 1].time) continue;
						if (trajectories[i].status !== SHOW) focusing = '';
						break;
					} else if (i == trajectories.length - 1) focusing = '';
				}
			}
			return { played, focusing };
		}, () => { this.player.seekTo(played); });
	}

	/* ==================== canvas ==================== */
    showAddButton = () => {
    	const { defaultNumberOfParentAnnotations, annotations, entities } = this.state;
    	const { numberOfParentAnnotationsToBeAdded } = this.props;
    	return (defaultNumberOfParentAnnotations + numberOfParentAnnotationsToBeAdded) > (this.getLastLabel(annotations, entities));
    }

    renderAddButton = () => {
    	const { adding } = this.state;
    	if (adding || !adding && this.showAddButton()) {
    		return (
    			<Button
    			disabled={ adding }
    				color='primary'
    				size='lg'
    				onClick={ this.handleAddClick }
    				className='d-flex align-items-center float-left'
    			>
    				<MdAdd />
    			{' '}
    			{adding ? 'Adding a New Box' : 'Add a New Box'}
    			</Button>
    		);
    	}
    	return null;
    }

	handleAddClick = () => {
		this.setState((prevState, props) => ({ adding: !prevState.adding, playing: false }));
	}

	handleCanvasStageMouseDown = (e) => {
		if (!this.state.adding) return;
		const stage = e.target.getStage();
		const position = stage.getPointerPosition();
		const timeNow = new Date().getTime().toString(36);
		const color = colors[getRandomInt(colors.length)];
		this.setState((prevState, props) => {
			this.UndoRedoState.save({ ...prevState, adding: false }); // Undo/Redo
			const {
				adding, focusing, annotations, entities, trajectoryCollapses,
			} = prevState;
			const trajectories = [];
			trajectories.push(new Trajectory({
				id: `${timeNow}`, name: `${timeNow}`, x: position.x, y: position.y, height: 1, width: 1, time: prevState.played,
			}));
			entities.annotations[`${timeNow}`] = new VideoAnnotation({
				id: `${timeNow}`, name: `${timeNow}`, label: `${this.getLastLabel(annotations, entities)}`, color, trajectories,
			});
			// this.counter++;
			// handle trajectory collapses
			trajectoryCollapses[`${timeNow}`] = false;
			return {
				adding: !prevState.adding,
							 focusing: `${timeNow}`,
							 annotations: [...annotations, `${timeNow}`],
							 entities: { ...entities, annotations: entities.annotations },
						   trajectoryCollapses,
			};
		}, () => {
			const group = stage.find(`.${timeNow}`)[0];
			const bottomRight = group.get('.bottomRight')[0];
			group.moveToTop();
			bottomRight.moveToTop();
			bottomRight.startDrag();
		});
	}

	handleCanvasGroupMouseDown = (e) => {
		const group = e.target.findAncestor('Group');
		this.setState({ playing: false, focusing: group.name() });
	}

	handleCanvasGroupDragEnd = (e) => {
		if (e.target.getClassName() !== 'Group') return;
		const group = e.target;
		const rect = group.get('Rect')[0];
		const topLeft = group.get('.topLeft')[0];
		const position = group.position();

		const timeNow = new Date().getTime().toString(36);
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState);
			const { entities, played } = prevState;
			const { annotations } = entities;
			const { trajectories } = entities.annotations[group.name()];
			for (let i = 0; i < trajectories.length; i++) {
				if (played >= trajectories[i].time) {
					// skip elapsed trajectories
					if (i !== trajectories.length - 1 && played >= trajectories[i + 1].time) continue;
					if (played === trajectories[i].time) {
						trajectories[i].x = position.x; trajectories[i].y = position.y; trajectories[i].width = rect.width(); trajectories[i].height = rect.height();
						break;
					}
					if (i === trajectories.length - 1) {
						trajectories.push(new Trajectory({
							id: `${timeNow}`, name: `${timeNow}`, x: position.x, y: position.y, width: rect.width(), height: rect.height(), time: played,
						}));
						break;
					}
					trajectories.splice(i + 1, 0, new Trajectory({
						id: `${timeNow}`, name: `${timeNow}`, x: position.x, y: position.y, height: rect.height(), width: rect.width(), time: played,
					}));
					break;
				}
			}
			return {};
			// return { entities: {...entities, ['annotations']: ...annotations }}
		});
	}

	handleCanvasDotMouseDown = (e) => {
		const group = e.target.findAncestor('Group');
		this.setState({ focusing: group.name() });
	}

	handleCanvasDotDragEnd = (e) => {
		const activeAnchor = e.target;
		const group = activeAnchor.getParent();
		const timeNow = new Date().getTime().toString(36);
		group.draggable(true);
		const topLeft = group.get('.topLeft')[0]; const topRight = group.get('.topRight')[0]; const bottomRight = group.get('.bottomRight')[0]; const
			bottomLeft = group.get('.bottomLeft')[0];
		const maxX = Math.max(topLeft.getAbsolutePosition().x, topRight.getAbsolutePosition().x, bottomRight.getAbsolutePosition().x, bottomLeft.getAbsolutePosition().x);
		const minX = Math.min(topLeft.getAbsolutePosition().x, topRight.getAbsolutePosition().x, bottomRight.getAbsolutePosition().x, bottomLeft.getAbsolutePosition().x);
		const maxY = Math.max(topLeft.getAbsolutePosition().y, topRight.getAbsolutePosition().y, bottomRight.getAbsolutePosition().y, bottomLeft.getAbsolutePosition().y);
		const minY = Math.min(topLeft.getAbsolutePosition().y, topRight.getAbsolutePosition().y, bottomRight.getAbsolutePosition().y, bottomLeft.getAbsolutePosition().y);
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState);
			const { entities, played } = prevState;
			const { annotations } = entities;
			const { trajectories } = entities.annotations[group.name()];
			for (let i = 0; i < trajectories.length; i++) {
				if (played >= trajectories[i].time) {
					// skip elapsed trajectories
					if (i !== trajectories.length - 1 && played >= trajectories[i + 1].time) continue;
					if (played === trajectories[i].time) {
						trajectories[i].x = minX; trajectories[i].y = minY; trajectories[i].height = maxY - minY; trajectories[i].width = maxX - minX;
						break;
					}
					trajectories.splice(i + 1, 0, new Trajectory({
						id: `${timeNow}`, name: `${timeNow}`, x: minX, y: minY, height: maxY - minY, width: maxX - minX, time: played,
					}));
					break;
				}
			}
			// console.log(`====save====`)
			// console.log(`x ${minX}, y ${minY}`)
			// console.log(`width ${maxX-minX}, height ${maxY-minY}`)

			annotations[group.name()].trajectories = trajectories;
			return { entities: { ...entities, annotations } };
		});
	}

	/* ==================== list ==================== */
	handleListAnnotationClick = (name) => {
		this.setState({ focusing: name });
	}

	handleListTrajectoryJump = (e) => {
		const { name } = e;
		const { time } = e;
		this.setState({ playing: false, focusing: name },
			() => { this.player.seekTo(parseFloat(time)); });
	}

	handleListTrajectoryToggle = (e) => {
		this.setState((prevState, props) => {
			const { trajectoryCollapses } = prevState;
			trajectoryCollapses[e] = !trajectoryCollapses[e];
			return { trajectoryCollapses };
		});
	}

	handleListTrajectoryDelete = (e) => {
		const { annotationName } = e;
		const { trajectoryName } = e;
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { entities } = prevState;
			const { annotations } = entities;
			const trajectories = entities.annotations[annotationName].trajectories.filter((t) => {
				if (t.name !== trajectoryName) return true;
				return false;
		  });
			annotations[annotationName].trajectories = trajectories;
			return { entities: { ...entities, annotations } };
		});
	}


	handleListAnnotationDelete = (name) => {
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { entities, annotations } = prevState;
			const entitiesAnnotations = entities.annotations;
			const { label } = entitiesAnnotations[name];
			// reorder the list
			if (!isNaN(label)) {
				const lastLabel = this.getLastLabel(annotations, entities) - 1;
				if (`${lastLabel}` !== '1' && `${lastLabel}` !== label) {
					const lastName = annotations.find(a => entitiesAnnotations[a].label === `${lastLabel}`);
					// console.log(lastName)
					this.renameLabel(annotations, entitiesAnnotations, lastName, label);
					// console.log(lastLabel);
				}
			}
			// remove name from the parent's children
			if (entitiesAnnotations[name].parent) {
				const parent = entitiesAnnotations[entitiesAnnotations[name].parent];
				const i = parent.children.indexOf(name);
				if (i !== -1) {
					parent.children.splice(i, 1);
					if (parent.children.length == 0 && parent.trajectories[parent.trajectories.length - 1].status === SPLIT) parent.trajectories[parent.trajectories.length - 1].status = SHOW;
				}
			}
			// remove all its children and itself recusively
			this.removeAnnotation(annotations, entitiesAnnotations, name);


			return { annotations, entities: { ...entities, annotations: entitiesAnnotations }, focusing: '' };
		});
	}

	removeAnnotation = (annotations, entitiesAnnotations, name) => {
		// console.log(name)
		// console.log(JSON.stringify(entitiesAnnotations[name]))
		if (entitiesAnnotations[name].children.length !== 0) {
			// console.log(JSON.stringify(entitiesAnnotations[name].children))
			entitiesAnnotations[name].children.forEach((c) => {
				// console.log("children")
				// console.log(c)
				this.removeAnnotation(annotations, entitiesAnnotations, c);
			});
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
		const i = annotations.indexOf(name);
		annotations.splice(i, 1);
	}

	renameLabel = (annotations, entitiesAnnotations, name, label) => {
		if (entitiesAnnotations[name].children.length !== 0) {
			entitiesAnnotations[name].children.forEach((c, index) => {
				this.renameLabel(annotations, entitiesAnnotations, c, `${label}-${index + 1}`);
			});
		}
		entitiesAnnotations[name].label = label;
	}

	handleListAnnotationShowHide = (e) => {
		const { name } = e;
		const { status } = e;
		const timeNow = new Date().getTime().toString(36);
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState);
			const { played, entities } = prevState;
			const { trajectories } = entities.annotations[name];
			for (let i = 0; i < trajectories.length; i++) {
				if (i === 0 && played < trajectories[i].time) {
					trajectories.splice(0, 0, new Trajectory({
						id: `${timeNow}`, name: `${timeNow}`, x: trajectories[i].x, y: trajectories[i].y, height: trajectories[i].height, width: trajectories[i].width, time: played, status,
					}));
					break;
				}
				if (played >= trajectories[i].time) {
					// skip elapsed trajectories
					if (i !== trajectories.length - 1 && played >= trajectories[i + 1].time) continue;
					if (played === trajectories[i].time) {
						trajectories.splice(i, 1, new Trajectory({
							...trajectories[i], id: `${timeNow}`, name: `${timeNow}`, status,
						}));
						break;
					}
					if (i === trajectories.length - 1) {
						trajectories.push(new Trajectory({
							id: `${timeNow}`, name: `${timeNow}`, x: trajectories[i].x, y: trajectories[i].y, height: trajectories[i].height, width: trajectories[i].width, time: played, status,
						}));
						break;
					}
					const interpoArea = interpolationArea({ startTraj: trajectories[i], endTraj: trajectories[i + 1], played });
					const interpoPos = interpolationPosition({ startTraj: trajectories[i], endTraj: trajectories[i + 1], played });
					trajectories.splice(i + 1, 0, new Trajectory({
						id: `${timeNow}`, name: `${timeNow}`, x: interpoPos.x, y: interpoPos.y, height: interpoArea.height, width: interpoArea.width, time: played, status,
					}));
					break;
				}
			}
			if (status === HIDE) Trajectory.clearRedundantTrajectories(trajectories, status);
			return { entities: { ...entities, annotations: entities.annotations } };
		});
	}


	handleListAnnotationSplit = (name) => {
		const timeNow = (new Date()).getTime().toString(36);
		const timeNowChild1 = ((new Date()).getTime() + 1).toString(36);
		const timeNowChild2 = ((new Date()).getTime() + 2).toString(36);
		const status = SPLIT;
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState);
			const { played, entities, annotations } = prevState;
			const parent = entities.annotations[name];
			// remove ex-children
			if (parent.children.length !== 0) {
				for (const c of parent.children) {
					delete entities.annotations[c];
					const i = annotations.indexOf(c);
					annotations.splice(i, 1);
				}
			}
			// make sure parent's color is different from its children
			let randomColor = colors[getRandomInt(colors.length)];
			while (parent.color === randomColor) randomColor = colors[getRandomInt(colors.length)];
			const childrenColor = randomColor;

			let parentX; let parentY; let parentWidth; let
				parentHeight;
			let { trajectories } = parent;
			for (let i = 0; i < trajectories.length; i++) {
				if (played >= trajectories[i].time) {
					if (i !== trajectories.length - 1 && played >= trajectories[i + 1].time) continue;
					parentX = trajectories[i].x;
					parentY = trajectories[i].y;
					parentWidth = trajectories[i].width;
					parentHeight = trajectories[i].height;
					if (played === trajectories[i].time) {
						trajectories.splice(i, 1, new Trajectory({
							...trajectories[i], id: `${timeNow}`, name: `${timeNow}`, status,
						}));
						trajectories = trajectories.slice(0, i + 1);
						break;
					}
					if (i === trajectories.length - 1) {
						trajectories.push(new Trajectory({
							id: `${timeNow}`, name: `${timeNow}`, x: trajectories[i].x, y: trajectories[i].y, height: trajectories[i].height, width: trajectories[i].width, time: played, status,
						}));
						break;
					}
					const interpoArea = interpolationArea({ startTraj: trajectories[i], endTraj: trajectories[i + 1], played });
					const interpoPos = interpolationPosition({ startTraj: trajectories[i], endTraj: trajectories[i + 1], played });
					parentX = interpoPos.x;
					parentY = interpoPos.y;
					parentWidth = interpoArea.width;
					parentHeight = interpoArea.height;
					trajectories.splice(i + 1, 0, new Trajectory({
						id: `${timeNow}`, name: `${timeNow}`, x: interpoPos.x, y: interpoPos.y, height: interpoArea.height, width: interpoArea.width, time: played, status,
					}));
					trajectories = trajectories.slice(0, i + 2);
					break;
				}
			}
			parent.children = [`${timeNowChild1}`, `${timeNowChild2}`];
			parent.trajectories = trajectories;
			const childTrajectories1 = [new Trajectory({
				id: `${timeNow}`, name: `${timeNow}`, x: parentX, y: parentY, height: parentHeight / 2, width: parentWidth / 2, time: played,
			})];
			const childTrajectories2 = [new Trajectory({
				id: `${timeNow}`, name: `${timeNow}`, x: parentX + parentWidth / 2 - 20, y: parentY + parentHeight / 2 - 20, height: parentHeight / 2, width: parentWidth / 2, time: played,
			})];
			entities.annotations[`${timeNowChild1}`] = new VideoAnnotation({
				id: `${timeNowChild1}`, name: `${timeNowChild1}`, label: `${parent.label}-1`, color: childrenColor, trajectories: childTrajectories1, parent: parent.name,
			});
			entities.annotations[`${timeNowChild2}`] = new VideoAnnotation({
				id: `${timeNowChild2}`, name: `${timeNowChild2}`, label: `${parent.label}-2`, color: childrenColor, trajectories: childTrajectories2, parent: parent.name,
			});
			const parentIndex = annotations.find(a => a === parent.name);
			annotations.splice(parentIndex, 0, `${timeNowChild1}`);
			annotations.splice(parentIndex, 0, `${timeNowChild2}`);
			return { annotations, entities, focusing: `${timeNowChild2}` };
		});
	}

	handleListVideoPause = () => {
		this.setState({ playing: false });
	}

	/* ==================== undo/redo ==================== */
	handleUndo = () => {
		if (this.UndoRedoState.previous.length === 0) return;
		this.setState((prevState, props) => {
			const state = this.UndoRedoState.undo(prevState);
			return { ...state };
		});
	}

	handleRedo = () => {
		if (this.UndoRedoState.next.length === 0) return;
		this.setState((prevState, props) => {
			const state = this.UndoRedoState.redo(prevState);
			return { ...state };
		});
	}

	/* ==================== preview ================ */
	handlePreviewed = () => {
		this.setState({ previewed: true });
	}

	/* ==================== review ==================== */
	handleReviewCancelSubmission = () => {
		this.setState({ loop: false, submitted: false, playing: false });
	}

	/* ==================== submit ==================== */
    isEmptyOrNotTrack = () => {
    	const { annotations, defaultNumberOfAnnotations, entities } = this.state;
    	if (!this.props.checkEmpty) return false;
    	if (annotations.length != 0 && defaultNumberOfAnnotations < annotations.length) {
    		for (const a of annotations) {
    			if (entities.annotations[a].trajectories.length < 2) return true;
    		}
    		return false;
    	}
    	return true;
    }

	handleSubmit = () => {
		const { annotations, defaultNumberOfAnnotations } = this.state;
		if (this.isEmptyOrNotTrack()) {
			this.setState({ dialogIsOpen: true, dialogTitle: 'Submission warning', dialogMessage: 'You must annotate and track one cell' });
			return;
		}
		if (!this.state.submitted && this.props.review) {
			this.setState({
				loop: true, submitted: true, played: 0, playing: true, focusing: '',
			});
			return;
		}
		const { annotationWidth, annotationHeight, entities } = this.state;
		const { url } = this.props;
		const annotation = new schema.Entity('annotations');
		const denormalizedAnnotations = denormalize({ annotations }, { annotations: [annotation] }, entities).annotations;
		denormalizedAnnotations.forEach((ann) => {
			delete ann.isManipulatable;
		});
		const data = {
			url, annotationWidth, annotationHeight, annotations: denormalizedAnnotations,
		};
		this.props.onSubmit(data);
	}

    handleDialogToggle = () => {
    	this.setState(prevState => ({ dialogIsOpen: !prevState.dialogIsOpen }));
    }

    render() {
    	const {
    		previewed,
    		submitted,
    		annotationWidth,
    		annotationHeight,
    		playing,
    		played,
    		playbackRate,
    		duration,
    		loop,
    		adding,
    		focusing,
    		entities,
    		annotations,
    		trajectoryCollapses,
    		dialogIsOpen,
    		dialogTitle,
    		dialogMessage,
    	} = this.state;
    	const {
    		url, previewHead, previewNotices, checkEmpty,
    	} = this.props;
    	// const playbackRate = this.props.playbackRate || 1;
    	// let panelHeight = annotationHeight<=MAX_PANEL_HEIGHT? annotationHeight:MAX_PANEL_HEIGHT;
    	let panelContent;
    	if (submitted) panelContent = <Review height={ annotationHeight } onConfirmSubmit={ this.handleSubmit } onCancelSubmit={ this.handleReviewCancelSubmission } />;
    	else if (previewed) {
    		panelContent = (
    		<div>
    			<div className='pb-3 clearfix' style={ { minWidth: '400px' } }>
    				{this.renderAddButton()}
    				<ButtonGroup className='float-right'>
    					<Button disabled={ this.UndoRedoState.previous.length == 0 } outline onClick={ this.handleUndo }><MdUndo /></Button>
    					<Button disabled={ this.UndoRedoState.next.length == 0 } outline onClick={ this.handleRedo }><MdRedo /></Button>
    				</ButtonGroup>
    			</div>
    			<List
    					entities={ entities }
													  annotations={ annotations }
													  duration={ duration }
													  played={ played }
													  focusing={ focusing }
													  height={ annotationHeight }
													  trajectoryCollapses={ trajectoryCollapses }
													  onListVideoPause={ this.handleListVideoPause }
													  onListAnnotationClick={ this.handleListAnnotationClick }
													  onListAnnotationDelete={ this.handleListAnnotationDelete }
													  onListAnnotationShowHide={ this.handleListAnnotationShowHide }
													  onListAnnotationSplit={ this.handleListAnnotationSplit }
													  onListTrajectoryJump={ this.handleListTrajectoryJump }
													  onListTrajectoryDelete={ this.handleListTrajectoryDelete }
													  onListTrajectoryToggle={ this.handleListTrajectoryToggle }
    				checkEmpty={ checkEmpty }
    			/>
    		</div>
    	);
    	} else {
    		panelContent = <Preview height={ annotationHeight } notices={ previewNotices } head={ previewHead } onPreviewed={ this.handlePreviewed } />;
    	}

    	return (
    		<div>
    			<PopupDialog isOpen={ dialogIsOpen } title={ dialogTitle } message={ dialogMessage } handleToggle={ this.handleDialogToggle } />
    			<div className='d-flex flex-wrap justify-content-around py-3' style={ { background: 'rgb(246, 246, 246)' } }>
    				<div className='mb-3' style={ { width: annotationWidth } }>
    					<div style={ { position: 'relative' } }>
    						<VideoPlayerScreen
    							playerRef={ this.handlePlayerRef }
    							onReady={ this.handleVideoReady }
    							onProgress={ this.handleVideoProgress }
    							onDuration={ this.handleVideoDuration }
    							onEnded={ this.handleVideoEnded }
    							url={ url }
    							width={ annotationWidth }
    							playing={ playing }
    							loop={ loop }
    							playbackRate={ playbackRate }
    						/>
    						<Canvas
    							width={ annotationWidth }
    							height={ annotationHeight }
    							played={ played }
    							focusing={ focusing }
    							adding={ adding }
    							entities={ entities }
    							annotations={ annotations }
    							onStageMouseDown={ this.handleCanvasStageMouseDown }
    							onGroupMouseDown={ this.handleCanvasGroupMouseDown }
    							onGroupDragEnd={ this.handleCanvasGroupDragEnd }
    							onDotMouseDown={ this.handleCanvasDotMouseDown }
    							onDotDragEnd={ this.handleCanvasDotDragEnd }
    							checkEmpty={ checkEmpty }
    						/>
    					</div>
    					<VideoPlayerControl
    						playing={ playing }
    						played={ played }
    						playbackRate={ playbackRate }
    						duration={ duration }
    						onSliderMouseUp={ this.handlePlayerControlSliderMouseUp }
						    onSliderMouseDown={ this.handlePlayerControlSliderMouseDown }
    						onSliderChange={ this.handlePlayerControlSliderChange }
    						onRewind={ this.handlePlayerControlVideoRewind }
    						onPlayPause={ this.handlePlayerControlVideoPlayPause }
    						onSpeedChange={ this.handlePlayerControlVideoSpeedChange }
    					/>
    				</div>
    				<div className='mb-3'>
    					{panelContent}
    				</div>
    			</div>
    			<div className='d-flex justify-content-center pt-3'>
    				{submitted || !previewed ? '' : (<div><Button onClick={ this.handleSubmit }>Submit</Button></div>)}
    			</div>
    		</div>
    	);
    }
}

TwoDimensionalVideo.propTypes = {
	isDefaultAnnotationsManipulatable: PropTypes.bool,
	checkEmpty: PropTypes.bool,
	width: PropTypes.number,
	numberOfParentAnnotationsToBeAdded: PropTypes.number,
};
TwoDimensionalVideo.defaultProps = {
	defaultAnnotationsManipulatable: false,
	checkEmpty: false,
	numberOfParentAnnotationsToBeAdded: 1,
};
export default TwoDimensionalVideo;
