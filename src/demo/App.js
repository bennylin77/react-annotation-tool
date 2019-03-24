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
		const options1 = {'1':{id: '1', value: "Scene", children: {
										 	'1-1':{id: '1-1', value: "Location Inferrable", children: {}},
										 }},
		'2':{id: '2', value: "Object", children: {
											'2-1':{id: '2-1', value: "Face", children: {}},
											'2-2':{id: '2-2', value: "Tattoo", children: {}},
											'2-3':{id: '2-3', value: "Nudity", children: {}},
											'2-4':{id: '2-4', value: "License Plate", children: {}},
										 }},
		'3':{id: '3', value: "Text", children: {
			'3-1':{id: '3-1', value: "Letter", children: {}},
			'3-2':{id: '3-2', value: "Street Sign", children: {}},
			'3-3':{id: '3-3', value: "Menu", children: {}},
			'3-4':{id: '3-4', value: "Receipt", children: {}},
			'3-5':{id: '3-5', value: "Credit Card", children: {}},
			'3-6':{id: '3-6', value: "Computer Screen", children: {}},
			'3-7':{id: '3-7', value: "Pill Bottle", children: {}},
		}},
		}
		const options2 = {'1':{id: '1', name: "Scene", children: {
										 	'1-1':{id: '1-1', name: "Location Inferrable", children: {}},
										 }},
		'2':{id: '2', name: "Object", children: {
											'2-1':{id: '2-1', name: "Face", children: {}},
											'2-2':{id: '2-2', name: "Tattoo", children: {}},
											'2-3':{id: '2-3', name: "Nudity", children: {}},
											'2-4':{id: '2-4', name: "License Plate", children: {}},
										 }},
		'3':{id: '3', name: "Text", children: {
			'3-1':{id: '3-1', name: "Letter", children: {}},
			'3-2':{id: '3-2', name: "Street Sign", children: {}},
			'3-3':{id: '3-3', name: "Menu", children: {}},
			'3-4':{id: '3-4', name: "Receipt", children: {}},
			'3-5':{id: '3-5', name: "Credit Card", children: {}},
			'3-6':{id: '3-6', name: "Computer Screen", children: {}},
			'3-7':{id: '3-7', name: "Pill Bottle", children: {}},
		}},
		}
		const annotations1	= [{"id":"jkzs52ox","name":"jkzs52ox","color":"rgba(227,0,255,1)","x":297.171875,"y":110,"width":70.125,"height":55,"selectedOptionPath":[{"id":-1,"name":"root"},{"id":"3","name":"Text"},{"id":"3-1","name":"Letter"}],"optionInputValues":{}},{"id":2,"name":"jkzs541i","color":"rgba(227,0,255,1)","x":111.296875,"y":267,"width":112,"height":57,"selectedOptionPath":[{"id":-1,"name":"root"},{"id":"1","name":"Scene"},{"id":"1-1","name":"Location Inferrable"}],"optionInputValues":{}}]
		const annotations2 = [{"id":"jlhbb0cr","name":"jlhbb0cr","type":"Polygon","color":"rgba(227,0,255,1)","vertices":[{"id":"jlhbb0cr","name":"jlhbb0cr","x":228.8125,"y":126},{"id":"jlhbb0ng","name":"jlhbb0ng","x":254.5,"y":131},{"id":"jlhbb0uh","name":"jlhbb0uh","x":269.5,"y":145},{"id":"jlhbb11f","name":"jlhbb11f","x":280.5,"y":173},{"id":"jlhbb17w","name":"jlhbb17w","x":286.5,"y":215},{"id":"jlhbb1dw","name":"jlhbb1dw","x":287.5,"y":249},{"id":"jlhbb1jz","name":"jlhbb1jz","x":290.5,"y":281},{"id":"jlhbb1pz","name":"jlhbb1pz","x":291.5,"y":301},{"id":"jlhbb1w7","name":"jlhbb1w7","x":284.5,"y":310},{"id":"jlhbb21p","name":"jlhbb21p","x":272.5,"y":302},{"id":"jlhbb28k","name":"jlhbb28k","x":254.5,"y":299},{"id":"jlhbb2ee","name":"jlhbb2ee","x":239.5,"y":292},{"id":"jlhbb2jj","name":"jlhbb2jj","x":239.5,"y":267},{"id":"jlhbb2p1","name":"jlhbb2p1","x":234.5,"y":232},{"id":"jlhbb2uy","name":"jlhbb2uy","x":223.5,"y":206},{"id":"jlhbb30i","name":"jlhbb30i","x":220.5,"y":164},{"id":"jlhbb360","name":"jlhbb360","x":220.5,"y":141}],"selected":[{"id":"0","name":"root"},{"id":"1","value":"Scene"},{"id":"1-1","value":"Location Inferrable"}],"optionInputValues":{}},{"id":"jlhbb6tx","name":"jlhbb6tx","type":"Polygon","color":"rgba(255,219,0,1)","vertices":[{"id":"jlhbb6tx","name":"jlhbb6tx","x":103.5,"y":345},{"id":"jlhbb7hm","name":"jlhbb7hm","x":354.5,"y":306},{"id":"jlhbb80e","name":"jlhbb80e","x":385.5,"y":452},{"id":"jlhbb8st","name":"jlhbb8st","x":116.5,"y":479}],"selected":[{"id":"0","name":"root"},{"id":"2","value":"Object"},{"id":"2-1","value":"Face"}],"optionInputValues":{}}]
		const annotations3 = [{"id":"jn16mxig","name":"jn16mxig","color":"rgba(227,0,255,1)","trajectories":[{"id":"jn16mxie","name":"jn16mxie","x":329.75,"y":273,"width":59,"height":46,"time":0.2685566222222222,"status":"Show"},{"id":"jn16n6zm","name":"jn16n6zm","x":445.75,"y":423,"width":54.25,"height":46,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":"jn16mjd6"},{"id":"jn16mxif","name":"jn16mxif","color":"rgba(227,0,255,1)","trajectories":[{"id":"jn16mxie","name":"jn16mxie","x":182.75,"y":368,"width":59,"height":46,"time":0.2685566222222222,"status":"Show"},{"id":"jn16n8aq","name":"jn16n8aq","x":377.75,"y":450,"width":59,"height":46,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":"jn16mjd6"},{"id":"jn16mcqp","name":"jn16mcqp","color":"rgba(255,219,0,1)","trajectories":[{"id":"jn16mcqp","name":"jn16mcqp","x":220.75,"y":90,"width":209,"height":200,"time":0,"status":"Show"},{"id":"jn16msdn","name":"jn16msdn","x":214.75,"y":127,"width":209,"height":200,"time":0.472680412371134,"status":"Show"},{"id":"jn16n3jo","name":"jn16n3jo","x":485.75,"y":438,"width":14.25,"height":62,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mdz2","name":"jn16mdz2","color":"rgba(227,0,255,1)","trajectories":[{"id":"jn16mdz2","name":"jn16mdz2","x":289.75,"y":328,"width":91,"height":77,"time":0,"status":"Show"},{"id":"jn16n5z1","name":"jn16n5z1","x":446.75,"y":477,"width":53.25,"height":23,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mf41","name":"jn16mf41","color":"rgba(255,219,0,1)","trajectories":[{"id":"jn16mf41","name":"jn16mf41","x":75.75,"y":281,"width":112,"height":158,"time":0,"status":"Show"},{"id":"jn16n28z","name":"jn16n28z","x":152.43047082224646,"y":285.40894120247185,"width":112,"height":158,"time":0.2685566222222222,"status":"Show"},{"id":"jn16mssx","name":"jn16mssx","x":129.75,"y":287,"width":112,"height":158,"time":0.472680412371134,"status":"Show"},{"id":"jn16n50i","name":"jn16n50i","x":365.75,"y":390,"width":112,"height":108,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mgz6","name":"jn16mgz6","color":"rgba(255,0,0,1)","trajectories":[{"id":"jn16mgz6","name":"jn16mgz6","x":97.75,"y":101,"width":126,"height":120,"time":0,"status":"Show"},{"id":"jn16mu5o","name":"jn16mu5o","x":149.75,"y":160,"width":126,"height":120,"time":0.2685566222222222,"status":"Show"},{"id":"jn16n4eh","name":"jn16n4eh","x":421.75,"y":330,"width":78.25,"height":120,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mi1y","name":"jn16mi1y","color":"rgba(0,255,81,1)","trajectories":[{"id":"jn16mi1y","name":"jn16mi1y","x":241.75,"y":408,"width":144,"height":58,"time":0,"status":"Show"},{"id":"jn16mrjm","name":"jn16mrjm","x":221.75,"y":302,"width":144,"height":58,"time":0.472680412371134,"status":"Show"},{"id":"jn16n5h8","name":"jn16n5h8","x":317.75,"y":397,"width":144,"height":58,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mjd6","name":"jn16mjd6","color":"rgba(255,219,0,1)","trajectories":[{"id":"jn16mjd6","name":"jn16mjd6","x":175.75,"y":300,"width":118,"height":92,"time":0,"status":"Show"},{"id":"jn16mxie","name":"jn16mxie","x":175.75,"y":300,"width":118,"height":92,"time":0.2685566222222222,"status":"Split"}],"children":["jn16mxif","jn16mxig"],"parent":""},{"id":"jn16mkj2","name":"jn16mkj2","color":"rgba(227,0,255,1)","trajectories":[{"id":"jn16mkj2","name":"jn16mkj2","x":398.75,"y":293,"width":57,"height":57,"time":0,"status":"Show"},{"id":"jn16n8x8","name":"jn16n8x8","x":500,"y":457,"width":0,"height":43,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mlin","name":"jn16mlin","color":"rgba(0,255,81,1)","trajectories":[{"id":"jn16mlin","name":"jn16mlin","x":302.75,"y":29,"width":88,"height":68,"time":0,"status":"Show"},{"id":"jn16n9p4","name":"jn16n9p4","x":460.75,"y":375,"width":39.25,"height":68,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""},{"id":"jn16mmiw","name":"jn16mmiw","color":"rgba(255,219,0,1)","trajectories":[{"id":"jn16mmiw","name":"jn16mmiw","x":131.75,"y":40,"width":113,"height":125,"time":0,"status":"Show"},{"id":"jn16muof","name":"jn16muof","x":53.75,"y":105,"width":113,"height":125,"time":0.2685566222222222,"status":"Show"},{"id":"jn16naje","name":"jn16naje","x":374.75,"y":414,"width":113,"height":86,"time":0.6314432888888889,"status":"Show"}],"children":[],"parent":""}]

		const tasks = [{id: "1", annotator: "annotator_1", color: "rgba(0,255,81,1)", category:"Others", annotations: annotations1 }]
		const previewNotices = ["Cell's body range.", "The time at which that cell <u>splits</u>, <u>leaves</u>, <u>is obscured</u> or <u>shows up</u> (if applicable)."]

/*
{"annotator":"5b90d3be53fd687c0b439897",
	"annotations":[],
	"category":"No PII",
	"annotationWidth":500,
	"annotationHeight":670,
	"annotationDuration":3701,
	"annotationScaleFactor":0.5165289256198347},
{"annotator":"5b90d3c853fd687c0b439898",
*/
	const an1 = [{"id":"jlsv4spq","name":"jlsv4spq","type":"Polygon","color":"rgba(0,255,81,1)","vertices":[{"id":"jlsv4spq","name":"jlsv4spq","x":94.59375,"y":246},{"id":"jlsv4udt","name":"jlsv4udt","x":264,"y":175},{"id":"jlsv4vou","name":"jlsv4vou","x":137,"y":263}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-4","value":"Miscellaneous Papers"}]},{"id":"jlsv651c","name":"jlsv651c","type":"Polygon","color":"rgba(255,219,0,1)","vertices":[{"id":"jlsv651c","name":"jlsv651c","x":1,"y":87},{"id":"jlsv66kg","name":"jlsv66kg","x":76,"y":86},{"id":"jlsv67sr","name":"jlsv67sr","x":1,"y":138}],"selected":[{"id":"0","value":"root"},{"id":"1","value":"Object"},{"id":"1-1","value":"Face"}]},{"id":"jlsv7kzj","name":"jlsv7kzj","type":"Polygon","color":"rgba(255,0,0,1)","vertices":[{"id":"jlsv7kzj","name":"jlsv7kzj","x":256,"y":2},{"id":"jlsv7m61","name":"jlsv7m61","x":391,"y":30},{"id":"jlsv7neq","name":"jlsv7neq","x":343,"y":51},{"id":"jlsv7o84","name":"jlsv7o84","x":228,"y":47}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-15","value":"Suspicious"}]}]

	//,"category":"Others","annotationWidth":500,"annotationHeight":669,"annotationDuration":183739,"annotationScaleFactor":0.5165289256198347},

//{"annotator":"5b90d3d453fd687c0b439899",
	const an2 = [{"id":"jlthdtul","name":"jlthdtul","type":"Polygon","color":"rgba(0,255,81,1)","vertices":[{"id":"jlthdtul","name":"jlthdtul","x":98.0625,"y":256.5},{"id":"jlthdveh","name":"jlthdveh","x":136,"y":259.5},{"id":"jlthdw47","name":"jlthdw47","x":164,"y":249.5},{"id":"jlthdwxe","name":"jlthdwxe","x":202,"y":226.5},{"id":"jlthdyc6","name":"jlthdyc6","x":253,"y":191.5},{"id":"jlthdzjd","name":"jlthdzjd","x":196,"y":201.5},{"id":"jlthe0wz","name":"jlthe0wz","x":141,"y":223.5},{"id":"jlthe2jz","name":"jlthe2jz","x":102,"y":240.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-4","value":"Miscellaneous Papers"}]},{"id":"jlthefok","name":"jlthefok","type":"Polygon","color":"rgba(227,0,255,1)","vertices":[{"id":"jlthefok","name":"jlthefok","x":281,"y":68.5},{"id":"jlthegrj","name":"jlthegrj","x":337,"y":53.5},{"id":"jltheii8","name":"jltheii8","x":392,"y":34.5},{"id":"jlthejgz","name":"jlthejgz","x":331,"y":19.5},{"id":"jlthele0","name":"jlthele0","x":262,"y":1.5},{"id":"jltherjs","name":"jltherjs","x":242,"y":50.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-15","value":"Suspicious"}]}]

	//"category":"Others","annotationWidth":500,"annotationHeight":669,"annotationDuration":3489,"annotationScaleFactor":0.5165289256198347},
//{"annotator":"5b92ca3b84aba00655f3fb03",
	const an3 =[{"id":"jly6x8sl","name":"jly6x8sl","type":"Polygon","color":"rgba(255,219,0,1)","vertices":[{"id":"jly6x8sl","name":"jly6x8sl","x":98.625,"y":243.5},{"id":"jly6x9t9","name":"jly6x9t9","x":191.5,"y":198.5},{"id":"jly6xafo","name":"jly6xafo","x":236.5,"y":193.5},{"id":"jly6xb8u","name":"jly6xb8u","x":165.5,"y":248.5},{"id":"jly6xbql","name":"jly6xbql","x":152.5,"y":246.5},{"id":"jly6xc9b","name":"jly6xc9b","x":119.5,"y":268.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-4","value":"Miscellaneous Papers"}]},{"id":"jly6yqru","name":"jly6yqru","type":"Polygon","color":"rgba(227,0,255,1)","vertices":[{"id":"jly6yqru","name":"jly6yqru","x":256.5,"y":2.5},{"id":"jly6ytys","name":"jly6ytys","x":327.5,"y":9.5},{"id":"jly6yuo6","name":"jly6yuo6","x":331.5,"y":19.5},{"id":"jly6yvej","name":"jly6yvej","x":389.5,"y":29.5},{"id":"jly6yw66","name":"jly6yw66","x":368.5,"y":52.5},{"id":"jly6ywqc","name":"jly6ywqc","x":347.5,"y":48.5},{"id":"jly6yx3z","name":"jly6yx3z","x":339.5,"y":52.5},{"id":"jly6yypb","name":"jly6yypb","x":291.5,"y":62.5},{"id":"jly6z0nz","name":"jly6z0nz","x":242.5,"y":60.5},{"id":"jly6z19l","name":"jly6z19l","x":223.5,"y":50.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-1","value":"Letter"}]}]

	//,"category":"Others","annotationWidth":500,"annotationHeight":669,"annotationDuration":931993,"annotationScaleFactor":0.5165289256198347}
	//[{"annotator":"5b90d3be53fd687c0b439897",
	const an4 =[{"id":"jlz9zapz","name":"jlz9zapz","type":"Polygon","color":"rgba(0,4,255,1)","vertices":[{"id":"jlz9zapz","name":"jlz9zapz","x":180.53693389892578,"y":166.8664779663086},{"id":"jlz9zcuq","name":"jlz9zcuq","x":215.31818389892578,"y":317.8664779663086},{"id":"jlz9zfxp","name":"jlz9zfxp","x":420.3181838989258,"y":251.8664779663086},{"id":"jlz9zh6j","name":"jlz9zh6j","x":443.3181838989258,"y":308.8664779663086},{"id":"jlz9zirk","name":"jlz9zirk","x":496.3181838989258,"y":289.8664779663086},{"id":"jlz9zk8k","name":"jlz9zk8k","x":497.3181838989258,"y":85.8664779663086}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-4","value":"Miscellaneous Papers"}]},{"id":"jlzftcyi","name":"jlzftcyi","type":"Polygon","color":"rgba(0,255,81,1)","vertices":[{"id":"jlzftcyi","name":"jlzftcyi","x":181.5999984741211,"y":580.3000030517578},{"id":"jlzftds6","name":"jlzftds6","x":353.5999984741211,"y":532.3000030517578},{"id":"jlzftf3o","name":"jlzftf3o","x":372.5999984741211,"y":565.3000030517578},{"id":"jlzftfv5","name":"jlzftfv5","x":497.5999984741211,"y":522.3000030517578},{"id":"jlzfthca","name":"jlzfthca","x":495.5999984741211,"y":661.3000030517578},{"id":"jlzftify","name":"jlzftify","x":261.5999984741211,"y":660.3000030517578}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-1","value":"Letter"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":666,"annotationDuration":55472,"annotationScaleFactor":0.4084967320261438},

	//{"annotator":"5b90d3c853fd687c0b439898",
	const an5 = [{"id":"jlsvg10m","name":"jlsvg10m","type":"Polygon","color":"rgba(0,255,81,1)","vertices":[{"id":"jlsvg10m","name":"jlsvg10m","x":180.55516052246094,"y":172.84927368164062},{"id":"jlsvg2hy","name":"jlsvg2hy","x":456.47059631347656,"y":83.84927368164062},{"id":"jlsvg50z","name":"jlsvg50z","x":498.47059631347656,"y":150.84927368164062},{"id":"jlsvg636","name":"jlsvg636","x":500,"y":225.84927368164062},{"id":"jlsvg6z2","name":"jlsvg6z2","x":222.47059631347656,"y":322.8492736816406}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-7","value":"Business Card"}]},{"id":"jlsvgo6s","name":"jlsvgo6s","type":"Polygon","color":"rgba(0,4,255,1)","vertices":[{"id":"jlsvgo6s","name":"jlsvgo6s","x":173.47059631347656,"y":586.8492736816406},{"id":"jlsvgpcy","name":"jlsvgpcy","x":475.47059631347656,"y":521.8492736816406},{"id":"jlsvgqyj","name":"jlsvgqyj","x":498.47059631347656,"y":661.8492736816406}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-15","value":"Suspicious"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":667,"annotationDuration":70236,"annotationScaleFactor":0.4084967320261438},

	//{"annotator":"5b90d3d453fd687c0b439899",
	const an6 =[{"id":"jlthjfs2","name":"jlthjfs2","type":"Polygon","color":"rgba(0,4,255,1)","vertices":[{"id":"jlthjfs2","name":"jlthjfs2","x":183.0625,"y":175.5},{"id":"jlthjhhr","name":"jlthjhhr","x":458,"y":88.5},{"id":"jlthjjd5","name":"jlthjjd5","x":487,"y":168.5},{"id":"jlthjkn9","name":"jlthjkn9","x":497,"y":173.5},{"id":"jlthjn27","name":"jlthjn27","x":498,"y":363.5},{"id":"jlthjous","name":"jlthjous","x":408,"y":250.5},{"id":"jlthjrdz","name":"jlthjrdz","x":231,"y":323.5},{"id":"jlthk27u","name":"jlthk27u","x":32,"y":392.5},{"id":"jlthk3e4","name":"jlthk3e4","x":3,"y":222.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-4","value":"Miscellaneous Papers"}]},{"id":"jlthkcff","name":"jlthkcff","type":"Polygon","color":"rgba(255,0,0,1)","vertices":[{"id":"jlthkcff","name":"jlthkcff","x":191,"y":576.5},{"id":"jlthkdkn","name":"jlthkdkn","x":472,"y":531.5},{"id":"jlthkeby","name":"jlthkeby","x":487,"y":596.5},{"id":"jlthkf5k","name":"jlthkf5k","x":228,"y":629.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-4","value":"Miscellaneous Papers"}]}]

	//,"category":"Others","annotationWidth":500,"annotationHeight":667,"annotationDuration":5709,"annotationScaleFactor":0.4084967320261438},

	//{"annotator":"5b92ca3b84aba00655f3fb03",
	const an7 =[{"id":"jlyjj7nv","name":"jlyjj7nv","type":"Polygon","color":"rgba(255,0,0,1)","vertices":[{"id":"jlyjj7nv","name":"jlyjj7nv","x":190.375,"y":579.5},{"id":"jlyjj8g2","name":"jlyjj8g2","x":466.25,"y":523.5},{"id":"jlyjj8yw","name":"jlyjj8yw","x":480.25,"y":587.5},{"id":"jlyjj9v6","name":"jlyjj9v6","x":222.25,"y":633.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-16","value":"Other"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":667,"annotationDuration":1326671,"annotationScaleFactor":0.4084967320261438}]},

//{"_id":"5b90b86b645739116286f315","url":"VizWiz_v2_000000032174.jpg","tasks":[{"annotator":"5b90d3be53fd687c0b439897",
	const an8 = [{"id":"jlzfuig7","name":"jlzfuig7","type":"Polygon","color":"rgba(255,0,0,1)","vertices":[{"id":"jlzfuig7","name":"jlzfuig7","x":71.11249923706055,"y":69.5},{"id":"jlzfuje9","name":"jlzfuje9","x":190.5999984741211,"y":63.5},{"id":"jlzfukfs","name":"jlzfukfs","x":199.5999984741211,"y":278.5},{"id":"jlzfuls7","name":"jlzfuls7","x":488.5999984741211,"y":268.5},{"id":"jlzfumci","name":"jlzfumci","x":483.5999984741211,"y":287.5},{"id":"jlzfunlt","name":"jlzfunlt","x":91.5999984741211,"y":300.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-2","value":"Computer Screen"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":670,"annotationDuration":36179,"annotationScaleFactor":0.5165289256198347},

	const an9 = [{"id":"jlsvivj3","name":"jlsvivj3","type":"Polygon","color":"rgba(0,4,255,1)","vertices":[{"id":"jlsvivj3","name":"jlsvivj3","x":356.55516052246094,"y":259.8492736816406},{"id":"jlsviwmu","name":"jlsviwmu","x":481.47059631347656,"y":255.84927368164062},{"id":"jlsvixca","name":"jlsvixca","x":484.47059631347656,"y":291.8492736816406},{"id":"jlsviy3x","name":"jlsviy3x","x":358.47059631347656,"y":290.8492736816406}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-2","value":"Computer Screen"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":669,"annotationDuration":46638,"annotationScaleFactor":0.5165289256198347},

	const an10 = [{"id":"jlthm0yx","name":"jlthm0yx","type":"Polygon","color":"rgba(0,255,81,1)","vertices":[{"id":"jlthm0yx","name":"jlthm0yx","x":356.0625,"y":255.5},{"id":"jlthm1vh","name":"jlthm1vh","x":444,"y":257.5},{"id":"jlthm4ck","name":"jlthm4ck","x":443,"y":289.5},{"id":"jlthm4yy","name":"jlthm4yy","x":359,"y":292.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-2","value":"Computer Screen"}]},{"id":"jlthmdmq","name":"jlthmdmq","type":"Polygon","color":"rgba(227,0,255,1)","vertices":[{"id":"jlthmdmq","name":"jlthmdmq","x":295,"y":23.5},{"id":"jlthme5h","name":"jlthme5h","x":299,"y":50.5},{"id":"jlthmf20","name":"jlthmf20","x":388,"y":39.5},{"id":"jlthmfis","name":"jlthmfis","x":384,"y":17.5}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-2","value":"Computer Screen"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":669,"annotationDuration":2524,"annotationScaleFactor":0.5165289256198347},

	const an11 = [{"id":"jlyjm4py","name":"jlyjm4py","type":"Polygon","color":"rgba(227,0,255,1)","vertices":[{"id":"jlyjm4py","name":"jlyjm4py","x":353.36249923706055,"y":258.8999938964844},{"id":"jlyjm5em","name":"jlyjm5em","x":444.79999923706055,"y":255.89999389648438},{"id":"jlyjm5v2","name":"jlyjm5v2","x":444.79999923706055,"y":269.8999938964844},{"id":"jlyjm6ci","name":"jlyjm6ci","x":477.79999923706055,"y":269.8999938964844},{"id":"jlyjm6ul","name":"jlyjm6ul","x":480.79999923706055,"y":285.8999938964844},{"id":"jlyjm7r8","name":"jlyjm7r8","x":356.79999923706055,"y":289.8999938964844}],"selected":[{"id":"0","value":"root"},{"id":"2","value":"Text"},{"id":"2-15","value":"Suspicious"}]}]
	//,"category":"Others","annotationWidth":500,"annotationHeight":669,"annotationDuration":1232688,"annotationScaleFactor":0.5165289256198347}]},

//previewNotices = {previewNotices}
		return(
			<div>
				<div className="mb-5">
					<VideoTool onSubmit={this.handleSubmit}
										 url={"https://cildata.crbs.ucsd.edu/media/videos/15793/15793_web.mp4"}
										 annotationWidth={500}
										 review
										 checkEmpty
										 
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
										 annotations = {an11}
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






/*
<div className="mb-5">
	<VideoTool onSubmit={this.handleSubmit}
						 url={"https://cildata.crbs.ucsd.edu/media/videos/15793/15793_web.mp4"}
						 annotationWidth={500}
						 annotations = {annotations3}
						 previewNotices = {previewNotices}
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
						 annotations = {an1}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/pc82dgxxmjg1sk9/VizWiz_v2_000000031236.jpg?raw=1"}
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
						 annotations = {an2}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/pc82dgxxmjg1sk9/VizWiz_v2_000000031236.jpg?raw=1"}
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
						 annotations = {an3}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/pc82dgxxmjg1sk9/VizWiz_v2_000000031236.jpg?raw=1"}
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
						 annotations = {an4}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/w9mfwqxif3hbixl/VizWiz_v2_000000031905.jpg?raw=1"}
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
						 annotations = {an5}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/w9mfwqxif3hbixl/VizWiz_v2_000000031905.jpg?raw=1"}
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
						 annotations = {an6}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/w9mfwqxif3hbixl/VizWiz_v2_000000031905.jpg?raw=1"}
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
						 annotations = {an7}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/w9mfwqxif3hbixl/VizWiz_v2_000000031905.jpg?raw=1"}
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
						 annotations = {an8}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/989029ee7mlu1xf/VizWiz_v2_000000032174.jpg?raw=1"}
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
						 annotations = {an9}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/989029ee7mlu1xf/VizWiz_v2_000000032174.jpg?raw=1"}
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
						 annotations = {an10}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/989029ee7mlu1xf/VizWiz_v2_000000032174.jpg?raw=1"}
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
						 annotations = {an11}
						 disabledOptionLevels={[]}
						 dynamicOptions
						 labeled
						 url={"https://www.dropbox.com/s/989029ee7mlu1xf/VizWiz_v2_000000032174.jpg?raw=1"}
	/>
</div>


*/
