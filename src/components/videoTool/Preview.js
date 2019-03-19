import React, {Component} from 'react';
import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/Preview.css';

class Preview extends Component {
	constructor(props){
		super(props)
	}
	handleSubmit = () =>{
		this.props.onPreviewed()
	}

	render(){
		const {height, notices} = this.props
		const items = notices.map( n => <li key={n} dangerouslySetInnerHTML={{__html: n}} /> )
		return (<div className="d-flex align-items-center justify-content-center" style={{height: height}}>
							<div>
								Please quickly scan the video and observe the following to help you complete the task:
								<ul className="text-left focus-list">
									{items}
					    	</ul>
								<div>
									<Button className="mt-2" color="primary" onClick={this.handleSubmit}>Scanned the video and ready to start</Button>
								</div>
							</div>
						 </div>)
	}
}
export default Preview;
