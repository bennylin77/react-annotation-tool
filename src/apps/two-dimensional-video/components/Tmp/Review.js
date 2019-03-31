import React, {Component} from 'react';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/Review.css';

class Review extends Component {
	constructor(props){
		super(props)
	}
  render(){
		const {height} = this.props
		return (
			<div className="d-flex align-items-center justify-content-center text-center" style={{height: height}}>
				<div>
					<div>The video is replaying</div>
					<div className="mb-2">Make sure all the bounding boxes <b className="text-danger">PRECISELY</b> bound the objects</div>
					<div>
						<Button className="mb-1" color="primary" onClick={this.props.onCancelSubmission}>I want to adjust some boxes</Button> <Button className="mb-1" onClick={this.props.onConfirmSubmission}>Everything is great! Submit it</Button>
					</div>
				</div>
			</div>
		  );
  }
}
export default Review;



/*
import React, {Component} from 'react';
import {Button, FormGroup, Input} from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/Form.css';

class Form extends Component {
	constructor(props){
		super(props)
		this.state = {modal: false, feedback: ''};
	}
	toggle = () =>{
    this.setState({modal: !this.state.modal});
  }
	handleTextareaChange = (event) => {
    this.setState({feedback: event.target.value});
  }
	handleSubmit = () =>{
		const {feedback} = this.state;
		this.props.onFormSubmit(feedback)
	}
	handleCancelSubmission = () =>{
		this.props.onFormCancelSubmission()
	}

  render(){
		const { height, width, url, annotationWidth, annotationHeight, mturk, mturkAction, mturkAssignmentId, objects, submitted } = this.props
		let submitButton
		if (!mturk)
	    submitButton = <Button onClick={this.handleConfirmToSubmit}>Everything is great, submit it!</Button>;


		return (
			<div className="d-flex align-items-center justify-content-center text-center" style={{height: annotationHeight}}>
				<div>
					<div>The video is replaying</div>
					<div className="mb-2">Make sure all the bounding boxes <b className="text-danger">PRECISELY</b> bound the objects</div>
					<div>
						<Button className="mb-1" color="primary" onClick={this.handleCancelSubmission}>I want to adjust some boxes</Button> <Button className="mb-1" onClick={this.toggle}>Everything is great! Go next step</Button>
					</div>
				</div>
				<Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={'static'} backdropClassName={'modal-backdrop-form'}>
					<ModalHeader>Feedback</ModalHeader>
				 {mturk?
					 (<form method="POST" action={mturkAction}>
						<ModalBody>
							<div className="mb-4">
								<span className="align-middle">Thank you for doing this task. If you would like to provide us feedback regarding this task, please do so here. To submit and finish this task please click</span>
								<Button disabled style={{opacity: 1}} className="form-button" color="primary">Submit & Finsish</Button>
								<span className="align-middle">below.</span>
							</div>
							<Input type="textarea" name="feedback" id="feedback" placeholder="Write some feedback here... (optional)"/>
						</ModalBody>
						<ModalFooter>
							<input type="hidden" id="assignmentId" name="assignmentId" value={mturkAssignmentId}/>
							<input type="hidden" id="url" name="url" value={url}/>
							<input type="hidden" id="width" name="width" value={width}/>
							<input type="hidden" id="height" name="height" value={height}/>
							<input type="hidden" id="annotationWidth" name="annotationWidth" value={annotationWidth}/>
							<input type="hidden" id="annotationHeight" name="annotationHeight" value={annotationHeight}/>
							<input type="hidden" id="objects" name="objects" value={JSON.stringify(objects)}/>
							<Button color="primary">Submit & Finsish</Button>
						</ModalFooter>
						</form>):(
						<div>
						<ModalBody>
							<div className="mb-4">
								<span className="align-middle">Thank you for doing this task. If you would like to provide us feedback regarding this task, please do so here. To submit and finish this task please click</span>
								<Button disabled style={{opacity: 1}} className="form-button" color="primary">Submit & Finsish</Button>
								<span className="align-middle">below.</span>
							</div>
							<Input type="textarea" name="feedback" id="feedback" placeholder="Write some feedback here... (optional)" onChange={this.handleTextareaChange}/>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" onClick={this.handleSubmit}>Submit & Finsish</Button>
						</ModalFooter>
						</div>)
					}
				</Modal>
			</div>

		  );
  }
}
export default Form;
*/
