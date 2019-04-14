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
