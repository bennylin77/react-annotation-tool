import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { ButtonGroup, Button, Collapse } from 'reactstrap';
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import ReactPlayer from 'react-player'

import { MdAdd, MdCallSplit, MdDelete, MdRedo, MdUndo, MdArrowForward} from "react-icons/md";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import './videoInstruction.css';


class Instructions extends Component {

	constructor(props){
		super(props)
		this.state = { collapse: false };
	}

	toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

	render(){
		return(
				<div>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
							<CardTitle>Motivation</CardTitle>
							<CardText className="mb-5">
							The result of this task will empower researchers to track cells in different life cycle phases and contribute towards treating and preventing diseases, leading to new bio-inspired technology, and answering
							basic science questions about fundamental biological processes.
							</CardText>
							<CardTitle>Task</CardTitle>
			<CardText className="mb-3">Your task is to use a bounding box to annotate and track <b className="text-uppercase text-danger">ONLY ONE</b> biological cell, as shown in the given video, <b className="text-uppercase text-danger">precisely</b>. You will adjust the box at different intervals of the video, and the tool will automatically fill the gaps in the video. You may, however, have to correct any imperfections in the annotations autocompleted by the tool to ensure that the gaps are correctly annotated.</CardText>
							<div className="mb-5 d-flex align-items-center">
								<figure className="figure">
									<ReactPlayer url='https://youtu.be/dnqS7uOWcOU' height={'140'} width={'100%'} playing loop muted />
								  <figcaption className="figure-caption">Before</figcaption>
								</figure>
								<MdArrowForward style={{margin: "0px 10px 30px 10px"}} />
								<figure className="figure">
								  <ReactPlayer url='https://youtu.be/BcXmdQrUeiI' height={'140'} width={'100%'} playing loop muted />
								  <figcaption className="figure-caption">After</figcaption>
								</figure>
							</div>
			<CardTitle className="mb-4">Instructions</CardTitle>
			<CardSubtitle className="font-weight-bold">Step 1: Before you start </CardSubtitle>
			<CardText className="mb-4 d-flex align-items-center">Scan the entire video, and choose a cell that you wish to annotate for this task. Then, you must return to the start of the video to track that cell by following the next steps. </CardText><CardText className="mb-4 d-flex align-items-center">  <b>Note</b>: You can adjust the speed of the video by clicking "<b>x1</b>" button located below the cell video.</CardText>
							<CardSubtitle className="font-weight-bold">Step 2: Add a bounding box </CardSubtitle>
			<CardText className="mb-4 d-flex align-items-center">After choosing the cell that you want to annotate, click <Button disabled style={{opacity: 1}} outline color="primary" className="d-flex align-items-center instruc-button"><MdAdd/> Add Annotation</Button>to add a new bounding box. Then, drag and adjust the size of the box to bound that cell.</CardText>
							<CardSubtitle className="font-weight-bold">Step 2: Track and bound <b className="text-uppercase text-danger">ONLY</b> the cell that you chose</CardSubtitle>
			<CardText className="mb-4">At different intervals of the video, relocate and resize the box to ensure the cell is bounded <b className="text-uppercase text-danger">precisely</b>; that is, keep the box tight against the shape of the cell. <b>Note</b>: This step need not be repeated for every single frame of the video. The tool will automatically fill the annotations in the missing frames between the intervals you annotated. You must verify that the automated annotation is accurate -- if not, adjust the box to correct the annotation.</CardText>
							<CardSubtitle className="font-weight-bold">Step 3a: Split the bounding box (if applicable)</CardSubtitle>
							<div className="d-flex align-items-center" style={{marginBottom: 5}}>If the tracked cell splits into two cells, use <Button disabled style={{opacity: 1}} outline className="d-flex align-items-center instruc-button"><MdCallSplit/> Split</Button> to split the parent bounding box into two children boxes and adjust the new boxes to fit the new cells.</div>
			<div className="mb-2 d-flex align-items-center">

								<figure className="figure">
								  <ReactPlayer url='https://youtu.be/HEBr3O9Z47I' height={'120'} width={'100%'} playing loop muted />
								  <figcaption className="figure-caption">Before</figcaption>
								</figure>
								<MdArrowForward style={{margin: "0px 10px 30px 10px"}} />
								<figure className="figure">
								  <ReactPlayer url='https://youtu.be/9EDQdesolq0' height={'120'} width={'100%'} playing loop muted />
								  <figcaption className="figure-caption">After</figcaption>
								</figure>
							</div>
							<CardSubtitle className="font-weight-bold">Step 3b: Hide or show the bounding box if the cell leaves the video frame or is obscured (if applicable)</CardSubtitle>
							<div className="d-flex align-items-center" style={{marginBottom: 5}}>If the cell leaves the video frame or is obscured by other objects, use <Button disabled style={{opacity: 1}} outline className="d-flex align-items-center instruc-button"><IoMdEyeOff/> Hide </Button> to hide its box. </div>
							<div className="mb-2 d-flex align-items-center">
									<figure className="figure">
									  <ReactPlayer url='https://youtu.be/YxilHqkKrfc' height={'120'} width={'100%'} playing loop muted />
									  <figcaption className="figure-caption">Before</figcaption>
									</figure>
									<MdArrowForward style={{margin: "0px 10px 30px 10px"}} />
									<figure className="figure">
									  <ReactPlayer url='https://youtu.be/0eclcrDoJTw' height={'120'} width={'100%'} playing loop muted />
									  <figcaption className="figure-caption">After</figcaption>
									</figure>
							</div>
							<CardSubtitle className="font-weight-bold">Step 4: Submit the task</CardSubtitle>
			<CardText className="d-flex align-items-center mb-5">After you have annotated the cell in the entire video, click <Button disabled style={{opacity: 1}} className="d-flex align-items-center instruc-button" >Submit</Button> to submit the results.</CardText>  <CardText className="d-flex align-items-center mb-5"> <b>Note</b>: You can redo the annotation or go back and forth in the video as many times as you like to ensure the cell is correctly annotated from the start to the end of the video.</CardText>

			<CardTitle>Demo of the tool</CardTitle>
			<div className="d-flex align-items-center" style={{marginBottom: 10}}>Here is a short demo of the instruction steps:</div>
			<div className="mb-3 d-flex align-items-center h=1000">
			<figure className="figure">
			<ReactPlayer url='https://youtu.be/Wv-mCWM-KIw' height={'40000'} width={'100%'} playing controls muted />
			</figure>
			</div>



			<CardTitle className="pt-3">Others Buttons:</CardTitle>
							<dl className="row">
							  <dt className="col-sm-2 text-right"><ButtonGroup><Button disabled style={{opacity: 1}} outline className="d-flex align-items-center"><MdUndo/></Button><Button disabled style={{opacity: 1}} outline className="d-flex align-items-center"><MdRedo/></Button></ButtonGroup></dt>
							  <dd className="col-sm-10 d-flex align-items-center" style={{marginBottom: 0}}>can be used to redo and undo the changes.</dd>
								<dt className="col-sm-2 text-right"><Button disabled style={{opacity: 1}} outline className="instruc-delete-button"><MdDelete/></Button></dt>
			<dd className="col-sm-10 d-flex align-items-center" style={{marginBottom: 0}}>can be used to delete a bounding box or a trajectory (tracking annotation).</dd>
								<dt className="col-sm-2 text-right">Resizing & Tracking history <FaChevronDown/></dt>
							  <dd className="col-sm-10 d-flex align-items-center" style={{marginBottom: 0}}> can be used to track your annotations.</dd>
							</dl>
						</CardBody>
          </Card>
        </Collapse>
				<Button outline block color="secondary" onClick={this.toggle}>{this.state.collapse? "Fold": "Unfold" } Instructions</Button>
				</div>
	)}
}

export default Instructions;
