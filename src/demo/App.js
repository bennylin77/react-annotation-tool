import React, { Component} from "react";
import {hot} from "react-hot-loader";
import {VideoTool} from "../Main.js";
import {ImageTool} from "../Main.js";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";



class App extends Component{

	constructor(props) {
	  super(props);
	}

	handleSubmit = r => {
    console.log(r)
  }

	componentDidMount(){}

  render(){
		const menu = {id: "0", value: "root", options: [
											{id: "1", value: "Object", options: [
														{id: "1-1", value: "Face", options: []},
														{id: "1-2", value: "Face Reflection", options: []},
														{id: "1-3", value: "Framed Photo", options: []},
														{id: "1-4", value: "Tattoo", options: []},
														{id: "1-5", value: "Suspicious", options: []},
														{id: "1-6", value: "Other", options: []},
												]},
											{id: "2", value: "Text", options: [
												{id: "2-1", value: "Letter", options: []},
												{id: "2-2", value: "Computer Screen", options: []},
												{id: "2-3", value: "Pill Bottle/Box", options: []},
												{id: "2-4", value: "Miscellaneous Papers", options: []},
												{id: "2-5", value: "Menu", options: []},
												{id: "2-6", value: "Credit Card", options: []},
												{id: "2-7", value: "Business Card", options: []},
												{id: "2-8", value: "Poster", options: []},
												{id: "2-9", value: "Clothing", options: []},
												{id: "2-10", value: "Book", options: []},
												{id: "2-11", value: "Receipt", options: []},
												{id: "2-12", value: "Street Sign", options: []},
												{id: "2-13", value: "License Plate", options: []},
												{id: "2-14", value: "Newspaper", options: []},
												{id: "2-15", value: "Suspicious", options: []},
												{id: "2-16", value: "Other", options: []},
											]}
										]}
    const videoAnnotations = [{"id":"jsbcm9hd","name":"jsbcm9hd","label":"2-2","color":"rgba(227,0,255,1)","isManipulatable":true,"trajectories":[{"id":"jsbcm9hb","name":"jsbcm9hb","x":406.86567869657165,"y":94.75480479558163,"width":37,"height":47.5,"time":0.128704896907216,"status":"Show"}],"children":[],"parent":"jsbcljur"},{"id":"jsbcm9hc","name":"jsbcm9hc","label":"2-1","color":"rgba(227,0,255,1)","isManipulatable":true,"trajectories":[{"id":"jsbcm9hb","name":"jsbcm9hb","x":389.86567869657165,"y":67.25480479558163,"width":37,"height":47.5,"time":0.128704896907216,"status":"Show"}],"children":[],"parent":"jsbcljur"},{"id":"jsbcm74f","name":"jsbcm74f","label":"1-2","color":"rgba(227,0,255,1)","isManipulatable":true,"trajectories":[{"id":"jsbcm74d","name":"jsbcm74d","x":218.3606817091667,"y":223.11433335380875,"width":45,"height":49,"time":0.128704896907216,"status":"Show"}],"children":[],"parent":"jsbcli9a"},{"id":"jsbcm74e","name":"jsbcm74e","label":"1-1","color":"rgba(227,0,255,1)","isManipulatable":true,"trajectories":[{"id":"jsbcm74d","name":"jsbcm74d","x":193.3606817091667,"y":194.11433335380875,"width":45,"height":49,"time":0.128704896907216,"status":"Show"}],"children":[],"parent":"jsbcli9a"},{"id":"jsbcli9a","name":"jsbcli9a","label":"1","color":"rgba(0,4,255,1)","isManipulatable":true,"trajectories":[{"id":"jsbcli9a","name":"jsbcli9a","x":59,"y":99,"width":90,"height":98,"time":0,"status":"Show"},{"id":"jsbcm74d","name":"jsbcm74d","x":193.3606817091667,"y":194.11433335380875,"width":90,"height":98,"time":0.128704896907216,"status":"Split"}],"children":["jsbcm74e","jsbcm74f"],"parent":""},{"id":"jsbcljur","name":"jsbcljur","label":"2","color":"rgba(0,255,81,1)","isManipulatable":true,"trajectories":[{"id":"jsbcljur","name":"jsbcljur","x":305,"y":111,"width":74,"height":95,"time":0,"status":"Show"},{"id":"jsbcm9hb","name":"jsbcm9hb","x":389.86567869657165,"y":67.25480479558163,"width":74,"height":95,"time":0.128704896907216,"status":"Split"}],"children":["jsbcm9hc","jsbcm9hd"],"parent":""}]
	const imageAnnotations = [{"id":"jlyjm4py","name":"jlyjm4py","type":"Polygon","color":"rgba(227,0,255,1)","vertices":[{"id":"jlyjm4py","name":"jlyjm4py","x":353.36249923706055,"y":258.8999938964844},{"id":"jlyjm5em","name":"jlyjm5em","x":444.79999923706055,"y":255.89999389648438},{"id":"jlyjm5v2","name":"jlyjm5v2","x":444.79999923706055,"y":269.8999938964844},{"id":"jlyjm6ci","name":"jlyjm6ci","x":477.79999923706055,"y":269.8999938964844},{"id":"jlyjm6ul","name":"jlyjm6ul","x":480.79999923706055,"y":285.8999938964844},{"id":"jlyjm7r8","name":"jlyjm7r8","x":356.79999923706055,"y":289.8999938964844}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-15","value":"Suspicious"}]}]

		return(
			<div>
				<div className="mb-5">
					<VideoTool onSubmit={this.handleSubmit}
										 url={"https://cildata.crbs.ucsd.edu/media/videos/15793/15793_web.mp4"}
										 annotationWidth={500}
										 annotations={videoAnnotations}
										 review
										 />
				</div>
				<div className="mb-5">
					<ImageTool onNextClick={this.handleSubmit}
										 onPreviousClick={this.handleSubmit}
										 onSkipClick={this.handleSubmit}
										 annotationWidth={500}
										 menu={menu}
										 category={"Others"}
										 categoryOptions = {["No Objects", "No Image"]}
										 annotations = {imageAnnotations}
										 disabledOptionLevels={[]}
										 dynamicOptions
										 labeled
										 url={"https://www.gtice.is/wp-content/uploads/2015/06/Snaefellsnes_Tour_Kirkjufell_by_KateI.jpg"}
					/>
				</div>
			</div>
	    );
	  }
}

export default hot(module)(App);
