import React, {Component} from 'react';
import './styles/Canvas.css';
import { Stage, Layer, Rect, Group, Text} from 'react-konva';
import {SHOW} from '../../models/2DVideo.js';
import {interpolationArea, interpolationPosition} from '../../helper.js';

class Canvas extends Component {
	constructor(props){
		super(props)
		this.state = {dotLength: 6}
	}
	handleMouseOver = e =>{
		const {adding} = this.props;
		if(adding)
			return;
		document.body.style.cursor = 'pointer';
	}
	handleStageMouseOver = e =>{
		if(this.props.adding)
			document.body.style.cursor = 'crosshair';
	}
	handleStageMouseLeave = e =>{
		document.body.style.cursor = 'default';
	}
	handleStageMouseOut = e =>{
		document.body.style.cursor = 'default';
	}

	handleStageMouseMove = e => {
	  this.props.onCanvasStageMouseMove(e);
	}
	handleStageMouseDown = e => {
	  this.props.onCanvasStageMouseDown(e);
	}
	handleStageMouseUp = e => {
		this.props.onCanvasStageMouseUp(e);
	}
	handleGroupMouseDown = e => {
		e.target.findAncestor('Group').moveToTop()
	  this.props.onCanvasGroupMouseDown(e);
	}
	handleGroupDragStart = e => {
		this.props.onCanvasGroupDragStart(e);
	}
	handleGroupDragMove = e => {
		if(e.target.getClassName() !== 'Group')
			return;
		const group = e.target;
		const {width, height} = this.props
		const topLeft = group.get('.topLeft')[0], topRight = group.get('.topRight')[0], bottomRight = group.get('.bottomRight')[0], bottomLeft = group.get('.bottomLeft')[0];
		const top = group.get('.top')[0], left = group.get('.left')[0], right = group.get('.right')[0], bottom = group.get('.bottom')[0];
		const rect = group.get('Rect')[0];
		const text = group.get('Text')[0];
		let resizedWidth, resizedHeight;
		let absX, absY;
		let activeAnchor;
		//boundary

		/*
		for(let dot of [topLeft, topRight, bottomRight, bottomLeft, top, bottom, left, right]){
			absX = dot.getAbsolutePosition().x
			absY = dot.getAbsolutePosition().y
			absX = absX < 0 ? 0:absX;
			absY = absY < 0 ? 0:absY;
			absX = absX > width ? width:absX;
			absY = absY > height ? height:absY;
			dot.setAbsolutePosition({x: absX, y:absY})
		}
		*/
		absX = topLeft.getAbsolutePosition().x
		absY = topLeft.getAbsolutePosition().y
		absX = absX < 0 ? 0:absX;
		absY = absY < 0 ? 0:absY;
		absX = absX+rect.width() > width ? width-rect.width():absX;
		absY = absY+rect.height() > height ? height-rect.height():absY;
		topLeft.setAbsolutePosition({x: absX, y:absY})
		group.x(topLeft.getAbsolutePosition().x)
		group.y(topLeft.getAbsolutePosition().y)
		topLeft.position({x: 0, y: 0});

/*
		topLeft.position({x: 0, y: 0});
		activeAnchor = topLeft;
		const anchorX = activeAnchor.getX();
		const anchorY = activeAnchor.getY();
		topRight.y(anchorY); top.y(anchorY); bottomLeft.x(anchorX); left.x(anchorX);
		resizedHeight = bottomRight.y()-topLeft.y()
		resizedWidth = bottomRight.x()-topLeft.x()
		top.x(anchorX+resizedWidth/2); left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2); bottom.x(anchorX+resizedWidth/2);
		text.x(anchorX); text.y(anchorY);
		rect.position(topLeft.position());
		rect.width(resizedWidth);
		rect.height(resizedHeight);
*/
		/*
		console.log(`topLeft.position() ${topLeft.position()}`)
		console.log(topLeft.position())
		console.log(`topLeft.getAbsolutePosition() ${topLeft.getAbsolutePosition()}`)
		console.log(topLeft.getAbsolutePosition())
		console.log(`group.position() ${group.position()}`)
		console.log(group.position())
		*/
		//this.props.onCanvasGroupDragMove(e);
	}

	handleGroupDragEnd = e => {
		if(e.target.getClassName() !== 'Group')
			return;
/*
		const group = e.target;
		const topLeft = group.get('.topLeft')[0]
		console.log(`topLeft.position() ${topLeft.position()}`)
		console.log(topLeft.position())
		console.log(`topLeft.getAbsolutePosition() ${topLeft.getAbsolutePosition()}`)
		console.log(topLeft.getAbsolutePosition())
		console.log(`group.position() ${group.position()}`)
		console.log(group.position())


		group.x(topLeft.getAbsolutePosition().x)
		group.y(topLeft.getAbsolutePosition().y)
*/
		this.props.onCanvasGroupDragEnd(e);
	}
	handleDotMouseOver = e => {
		const activeAnchor = e.target
		switch (activeAnchor.getName()) {
			case 'topLeft':
			case 'bottomRight':
				document.body.style.cursor = 'nwse-resize';
				break;
			case 'topRight':
			case 'bottomLeft':
				document.body.style.cursor = 'nesw-resize';
				break;
			case 'top':
			case 'bottom':
				document.body.style.cursor = 'ns-resize';
				break;
			case 'left':
			case 'right':
				document.body.style.cursor = 'ew-resize';
				break;
		}
	}
	handleDotMouseOut = e => {
		document.body.style.cursor = 'default';
	}
	handleDotMouseDown = e => {
		const group = e.target.findAncestor('Group')
		group.draggable(false)
		group.moveToTop()
		e.target.moveToTop()
		this.props.onCanvasDotMouseDown(e);
	}
	handleDotDragEnd = e => {
		this.props.onCanvasDotDragEnd(e)
		document.body.style.cursor = 'default';
	}
	handleDotDragMove = e => {
		const {width, height} = this.props
		const activeAnchor = e.target
		const group = activeAnchor.getParent();
		const topLeft = group.get('.topLeft')[0], topRight = group.get('.topRight')[0], bottomRight = group.get('.bottomRight')[0], bottomLeft = group.get('.bottomLeft')[0];
		const top = group.get('.top')[0], left = group.get('.left')[0], right = group.get('.right')[0], bottom = group.get('.bottom')[0];
		const rect = group.get('Rect')[0];
		const text = group.get('Text')[0];

		let resizedWidth, resizedHeight;
		//set box resizing boundary
		let absX = activeAnchor.getAbsolutePosition().x
		let absY = activeAnchor.getAbsolutePosition().y
		absX = absX < 0?0:absX;
		absY = absY < 0?0:absY;
		absX = absX > width?width:absX;
		absY = absY > height?height:absY;
		activeAnchor.setAbsolutePosition({x: absX, y:absY})
		const anchorX = activeAnchor.getX();
		const anchorY = activeAnchor.getY();
		// update anchor positions
		switch (activeAnchor.getName()) {
			case 'topLeft':
		  	topRight.y(anchorY); top.y(anchorY); bottomLeft.x(anchorX); left.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX+resizedWidth/2); left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2); bottom.x(anchorX+resizedWidth/2);
				text.x(anchorX); text.y(anchorY);
		    break;
			case 'topRight':
		    topLeft.y(anchorY); top.y(anchorY); bottomRight.x(anchorX); right.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX-resizedWidth/2); left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2); bottom.x(anchorX-resizedWidth/2);
				text.y(anchorY); text.x(anchorX-resizedWidth);
		    break;
		  case 'bottomRight':
		    bottomLeft.y(anchorY); bottom.y(anchorY); topRight.x(anchorX); right.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX-resizedWidth/2); left.y(anchorY-resizedHeight/2); right.y(anchorY-resizedHeight/2); bottom.x(anchorX-resizedWidth/2);
				text.x(anchorX-resizedWidth);
		    break;
		  case 'bottomLeft':
		    bottomRight.y(anchorY); bottom.y(anchorY); topLeft.x(anchorX); left.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX+resizedWidth/2); left.y(anchorY-resizedHeight/2); right.y(anchorY-resizedHeight/2); bottom.x(anchorX+resizedWidth/2);
				text.x(anchorX);
		    break;
			case 'top':
				topLeft.y(anchorY); topRight.y(anchorY);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(topLeft.x()+resizedWidth/2)
				left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2);
				text.y(anchorY);
			break;
			case 'left':
				topLeft.x(anchorX); bottomLeft.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				left.y(topLeft.y()+resizedHeight/2);
				top.x(anchorX+resizedWidth/2); bottom.x(anchorX+resizedWidth/2);
				text.x(anchorX);
			break;
			case 'right':
				topRight.x(anchorX); bottomRight.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				right.y(topLeft.y()+resizedHeight/2);
				top.x(anchorX-resizedWidth/2); bottom.x(anchorX-resizedWidth/2);
				text.x(anchorX-resizedWidth)
			break;
			case 'bottom':
				bottomLeft.y(anchorY); bottomRight.y(anchorY);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				bottom.x(topLeft.x()+resizedWidth/2);
				left.y(anchorY-resizedHeight/2); right.y(anchorY-resizedHeight/2);
			break;
		}


		group.x(topLeft.getAbsolutePosition().x)
		group.y(topLeft.getAbsolutePosition().y)
		topLeft.position({x: 0, y: 0});
		top.position({x: resizedWidth/2, y: 0});
		topRight.position({x: resizedWidth, y: 0});
		left.position({x: 0, y: resizedHeight/2});
		bottomLeft.position({x: 0, y: resizedHeight});
		right.position({x: resizedWidth, y: resizedHeight/2});
		bottom.position({x: resizedWidth/2, y: resizedHeight});
		bottomRight.position({x: resizedWidth, y: resizedHeight});
		rect.position(topLeft.position());
		rect.width(resizedWidth);
		rect.height(resizedHeight);
		text.position({x: 0, y: 0});





	}
	handle = e => {} //for testing

	render() {
		const { height, width, objects, played, focusing, adding, entities, annotations} = this.props;
		const { dotLength } = this.state
		const layerItems = [];

		annotations.slice().reverse().forEach( ann =>{

			const trajectories = entities.annotations[ann].trajectories;
			const color = entities.annotations[ann].color;
			const name = entities.annotations[ann].name;
			const label = entities.annotations[ann].label;

			for( let i = 0; i < trajectories.length; i++){
				let x, y, width, height;
				if(played >= trajectories[i].time){
					if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
						continue;
					if(trajectories[i].status!==SHOW)
						break; //todo

					if(i===trajectories.length-1){
						x=trajectories[i].x;
						y=trajectories[i].y;
						width=trajectories[i].width;
						height=trajectories[i].height;
					}else{
						let interpoArea = interpolationArea({startTraj: trajectories[i], endTraj: trajectories[i+1], played: played})
						let interpoPos = interpolationPosition({startTraj: trajectories[i], endTraj: trajectories[i+1], played: played})
						x = interpoPos.x;
						y = interpoPos.y;
						width = interpoArea.width;
						height = interpoArea.height;
					}
					/*
					console.log(`display`)
					console.log(`x ${x}, y ${y}`)
					console.log(`width ${width}, height ${height}`)
					*/
					const dots = []
					const fill = (focusing===name)? color.replace(/,1\)/, ",.3)"): ""
					const rect = <Rect x={0} y={0} fill={fill} width={width} height={height} stroke={color} strokeWidth={1} onMouseOver={this.handleMouseOver} />
					const labelText = <Text offsetY={20} x={0} y={0} fontFamily={'Calibri'} text={`${label}`} fontSize={16} lineHeight={1.2} fill={'#fff'} ></Text>
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={0} y={0} key={'topLeft'} name={'topLeft'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut}  />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width} y={0} key={'topRight'} name={'topRight'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width} y={height} key={'bottomRight'} name={'bottomRight'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={0} y={height} key={'bottomLeft'} name={'bottomLeft'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width/2} y={0} key={'top'} name={'top'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut}  />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={0} y={height/2} key={'left'} name={'left'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width} y={height/2} key={'right'} name={'right'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
					dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width/2} y={height} key={'bottom'} name={'bottom'} stroke={color} fill={color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
					layerItems.push(<Group x={x} y={y} key={name} name={name} draggable={true} onDragMove={this.handle} onMouseDown={this.handleGroupMouseDown} onDragEnd={this.handleGroupDragEnd} onDragStart={this.handleGroupDragStart} onDragMove={this.handleGroupDragMove}>{labelText}{rect}{dots}</Group>)
					break;
				}
			}
		})
		//console.log(`canvas width: ${width} canvas height: ${height}`)
		let addingLayer;
		if(adding)
			addingLayer = <Layer><Rect fill={'#ffffff'} width={width} height={height} opacity={.3} /><Text y={height/2} width={width} text={'Click and Drag here to add new box'} align={'center'} fontSize={16} fill={'#fff'} /></Layer>
		return(
						<Stage width={width} height={height} className="konva-wrapper" onMouseDown={this.handleStageMouseDown} onMouseUp={this.handleStageMouseUp} onMouseMove={this.handleStageMouseMove} onMouseOver={this.handleStageMouseOver} onMouseLeave={this.handleStageMouseLeave} onMouseOut={this.handleStageMouseOut}>
							 {addingLayer}
							 <Layer>{layerItems}</Layer>
				    </Stage>
					);
	}
}
export default Canvas;
