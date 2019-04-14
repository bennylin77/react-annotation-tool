import React, {Component} from 'react';
import Duration from '../VideoPlayer/FormattedTime/FormattedTime.jsx'
import {Rounding} from './helper.js'
import 'bootstrap/dist/css/bootstrap.css';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Collapse, Badge} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';
import { Events, scrollSpy, scroller} from 'react-scroll'

import {MdCallSplit, MdDelete, MdAdd} from 'react-icons/md';
import {FaChevronDown, FaChevronUp, FaArrowDown} from 'react-icons/fa';
import {IoMdEyeOff, IoMdEye} from 'react-icons/io';


import {SPLIT, HIDE, SHOW} from 'models/2DVideo.js';
import './styles/List.css';

class List extends Component {

	constructor(props){
		super(props)
		this.state = {modal: false, modalMessage: "", modalTitle: "", modalShowHideData: null, modalDeleteName: "", modalSplitName: "", disableSplitModal: false, disableShowHideModal: false, disableDeleteModal: false, checkbox: false}
	}

	componentDidMount = () =>{
    Events.scrollEvent.register('begin', (to, element) => {});
    Events.scrollEvent.register('end', (to, element) => {});
    scrollSpy.update();
  }
	componentWillUnmount = () =>{
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }
	componentDidUpdate = (prevProps) => {
		const { focusing } = this.props;
		// Typical usage (don't forget to compare props):
	  if ( focusing && focusing !== prevProps.focusing) {
	    scroller.scrollTo(focusing, {containerId: 'list-wrapper'});
	  }
		//
  }
	handleAnnotationClick = (name) =>{
		this.props.onListAnnotationClick(name)
	}
	handleDelete = (name) => {
		let modalDeleteName;
		this.setState((prevState, props) => {
			modalDeleteName = prevState.modalDeleteName;
			return { checkbox: false, disableDeleteModal: prevState.checkbox, modalDeleteName: "", modal: false,  modalMessage: "", modalTitle: ""}
		}, () => this.props.onListAnnotationDelete(modalDeleteName))
  }
	handleSplit = () => {
		let modalSplitName;
		this.setState((prevState, props) => {
			modalSplitName = prevState.modalSplitName;
			return { checkbox: false, disableSplitModal: prevState.checkbox, modalSplitName: "", modal: false,  modalMessage: "", modalTitle: ""}
		}, () => this.props.onListAnnotationSplit(modalSplitName))
  }
	handleShowHide = () => {
		let modalShowHideData;
		this.setState((prevState, props) => {
			modalShowHideData = prevState.modalShowHideData;
			return { checkbox: false, disableShowHideModal: prevState.checkbox, modalShowHideData: null, modal: false,  modalMessage: "", modalTitle: ""}
		}, () => this.props.onListAnnotationShowHide(modalShowHideData))
  }
	handleTrajectoryJump = (e) => {
		this.props.onListTrajectoryJump(e);
	}
	/*
	handleTrajectoryDelete = (e) => {
		this.props.onListTrajectoryDelete(e);
	}*/
	handleCheckboxChange = (e) =>{
		this.setState({ checkbox: e.target.checked})
	}
	handleDeleteModal = (name) => {
		const {disableDeleteModal} = this.state
		if(!disableDeleteModal)
			this.setState({ modalDeleteName: name, modal: true, modalMessage: "Are you sure you would like to delete this annotation?", modalTitle: "Delete this annotation"}, this.props.onListVideoPause())
		else
			this.props.onListAnnotationDelete(name)
	}
	handleSplitModal = (name) => {
		const {disableSplitModal} = this.state
		if(!disableSplitModal)
			this.setState({ modalSplitName: name, modal: true, modalMessage: "Does the object split into two and would you like to split this bounding box into two boxes?", modalTitle: "Split this box"}, this.props.onListVideoPause())
		else
			this.props.onListAnnotationSplit(name)
	}
	handleShowHideModal = (data) => {
		const {disableShowHideModal} = this.state
		if(!disableShowHideModal && data.status == SHOW)
			this.setState({ modalShowHideData: data, modal: true, modalMessage: "Does the object show up on the video and would you like to show its annotation?", modalTitle: `Show this annotation`})
		else if(!disableShowHideModal && data.status == HIDE)
			this.setState({ modalShowHideData: data, modal: true, modalMessage: "Does the object leave the video or is obscured by other objects and would you like to hide its annotation?", modalTitle: `Hide this annotation`}, this.props.onListVideoPause())
		else
			this.props.onListAnnotationShowHide(data)
	}

	handleModalToggle = () =>{
    this.setState({modal: !this.state.modal, checkbox: false, modalShowHideData: null, modalDeleteName: "", modalSplitName: "", modalMessage: "", modalTitle: ""});
  }

	findAnnotation = label =>{
		const {annotations, entities} = this.props;
		return annotations.find( ann=> entities.annotations[ann].label === label );
	}

	getSubAnnotations = i =>{
		const {annotations, entities} = this.props;
		const result = [];
		const queue = [];
		const id = this.findAnnotation(`${i}`);
		if(id){
			queue.push(id);
			result.push(id);
		}
		while(queue.length>0){
			const ann = queue.shift();
			for( let c of entities.annotations[ann].children ){
					result.push(c);
					queue.push(c);
			}
		}
		return result;
	}
	sortAnnotations = () =>{
		const {annotations, entities} = this.props;
		let sortedAnnotations = [];
		let i = 1;
		while(sortedAnnotations.length < annotations.length && i <= annotations.length){
			const subAnnotations = this.getSubAnnotations(i);
			sortedAnnotations = subAnnotations.concat(sortedAnnotations);
			i++;
		}
		return sortedAnnotations;
	}

  render() {
		const { objects, duration, played, focusing, height, entities, annotations, trajectoryCollapses, checkEmpty } = this.props;
		const items = [];
		const sortedAnn = this.sortAnnotations();
		//console.log(sortedAnn)
		sortedAnn.forEach( ann =>{
			if(!entities.annotations[ann].isManipulatable)
				return;


			const trajectories = entities.annotations[ann].trajectories;
			const trajectoryItems = []
			//const id = entities.annotations[ann].id;
			const name = entities.annotations[ann].name;
			const label = entities.annotations[ann].label;
			const parentAnn = entities.annotations[entities.annotations[ann].parent];
			const children = []
			for( let c of entities.annotations[ann].children )
				children.push(<span key={c} onClick={()=>this.handleAnnotationClick(c)} className="video-ann-relatives">{`${entities.annotations[c].label} `}</span>)
			const color = entities.annotations[ann].color;

			let split, show, hide;
			show = <Button outline className="d-flex align-items-center video-ann-button" onClick={()=>this.handleShowHideModal({name: name, status: SHOW})}><IoMdEye /> {SHOW}</Button>
			for( let i=0; i<trajectories.length; i++){
				const trajectoryStyle = {}
				if(trajectories[i].time === played )
					trajectoryStyle.color = "rgb(33, 37, 41)";
				trajectoryItems.push(<ListGroupItem key={trajectories[i].time} className="trajectory-item d-flex align-items-center justify-content-between">
															 <div className="trajectory d-flex justify-content-between" style={trajectoryStyle} onClick={()=>this.handleTrajectoryJump({name: name, time: trajectories[i].time})}>
																 <div className="trajectory-status pr-1"><b>{trajectories[i].status}</b> at <Duration seconds={duration*trajectories[i].time}/></div>
																 <div className="trajectory-size pr-1"><b>Size</b> <Rounding number={trajectories[i].width} /> x <Rounding number={trajectories[i].height} /></div>
																 <div className="trajectory-position"><b>Position</b> <Rounding number={trajectories[i].x} />, <Rounding number={trajectories[i].y} /></div>
															 </div>
															 <Button className="trajectory-delete" color="link" onClick={()=>this.props.onListTrajectoryDelete({annotationName: name, trajectoryName: trajectories[i].name})}><MdDelete /></Button>
														 </ListGroupItem>)
				let arrow;
				if( i!==trajectories.length-1 && played > trajectories[i].time && played < trajectories[i+1].time)
					arrow = <ListGroupItem key={trajectories[i].time+1} className="trajectory-item"><FaArrowDown style={{color: "", fontSize: "1em"}} /></ListGroupItem>
				else if( i===trajectories.length-1 && played > trajectories[i].time)
					arrow = <ListGroupItem key={trajectories[i].time+1} className="trajectory-item"><FaArrowDown style={{color: "", fontSize: "1em"}} /></ListGroupItem>
				else if( i!==trajectories.length-1 && played === trajectories[i+1].time)
					arrow = <ListGroupItem key={trajectories[i].time+1} className="trajectory-item"><FaArrowDown style={{color: "", fontSize: "1em"}} /></ListGroupItem>
				else
					arrow = ""
				trajectoryItems.push(arrow)


				if(played >= trajectories[i].time){
					if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
						continue;
					if(trajectories[i].status === SHOW){
						hide = <Button outline className="d-flex align-items-center video-ann-button" onClick={()=>this.handleShowHideModal({name: name, status: HIDE})}><IoMdEyeOff /> {HIDE}</Button>
						split = <Button outline className="d-flex align-items-center video-ann-button" onClick={()=>this.handleSplitModal(name) }><MdCallSplit/> {SPLIT}</Button>
						show = ""
					}
					if(trajectories[i].status === SPLIT )
						show = ""
				}
	    	}

			const warningText = checkEmpty && trajectories.length < 2 && <span className='text-danger'>You should track the cell bound by this box</span>
			if(name === focusing){
				items.push(<ListGroupItem className="video-ann video-ann-highlight" key={name} name={name} style={{borderColor: color.replace(/,1\)/, ",.3)")}}>
														 <div className="d-flex align-items-center mb-2">
																<div className="video-ann-title mr-auto"><strong>{label}</strong></div>
																{split}
																{hide}
																{show}
																<Button className="d-flex align-items-center video-ann-delete" color="link" onClick={()=>this.handleDeleteModal(name)}><MdDelete/></Button>
															</div>
															<div>{parentAnn? <div> <Badge color="secondary">Parent</Badge> <span onClick={()=>this.handleAnnotationClick(parentAnn.name)} className="video-ann-relatives">{entities.annotations[parentAnn.name].label}</span></div>: '' }</div>
															<div>{children.length>0? <div><Badge color="secondary">Children</Badge> {children}</div>: "" }</div>
															<div className="d-flex align-items-center justify-content-between trajectories-toggle p-3 mt-2" onClick={()=>this.props.onListTrajectoryToggle(name)} style={{ marginBottom: '0rem' }}>
																<div>Resizing & Tracking history</div>
																{trajectoryCollapses[name]?<FaChevronUp/>:<FaChevronDown/>}
															</div>
															<Collapse isOpen={trajectoryCollapses[name]}>
																<ListGroup className="px-3 py-2 text-center trajectory-wrapper">{trajectoryItems}</ListGroup>
															</Collapse>
															<div className='mt-3'>
																{warningText}
															</div>
											</ListGroupItem>)
			}else
				items.push(<ListGroupItem className="video-ann" key={name} name={name} onClick={()=>this.handleAnnotationClick(name)} action>
													 <div className="d-flex w-100 justify-content-between align-items-center">
															<div>{label}</div>
													 </div>
													 <div>{warningText}</div>
										  </ListGroupItem>)
		})
      if(items.length ==0)
	  return (<div className="d-flex align-items-center justify-content-center" style={{height: height-60}}>Click the button above to begin tracking a new cell </div>)
      return (
			<div>
				<ListGroup className="list-wrapper" id="list-wrapper" style={{maxHeight: height-60}}>{items}</ListGroup>
				<Modal isOpen={this.state.modal} toggle={this.handleModalToggle} backdrop={'static'}>
						<ModalHeader toggle={this.handleModalToggle}>{this.state.modalTitle}</ModalHeader>
						<ModalBody>
							{this.state.modalMessage}
						</ModalBody>
						<ModalFooter>
							<div className="d-flex align-items-center">
								<Label check>
									<Input type="checkbox" onChange={this.handleCheckboxChange}/>{' '}
									Don't show again
								</Label>
							</div>
							{this.state.modalSplitName? (<Button color="primary" onClick={this.handleSplit}>Yes</Button>) : ""}{' '}
							{this.state.modalShowHideData? (<Button color="primary" onClick={this.handleShowHide}>Yes</Button>) : ""}{' '}
							{this.state.modalDeleteName? (<Button color="primary" onClick={this.handleDelete}>Yes</Button>) : ""}{' '}
							<Button color="secondary" onClick={this.handleModalToggle}>No</Button>
						</ModalFooter>
				</Modal>
			</div>
		);
  }
}
export default List;
