import React, { Component } from 'react';
import './styles/Image.css';

class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zoom: 3, glassLeft: 0, glassTop: 0, glassBackgroundPosition: 0, glassBorderWidth: 3,
		};
	}

	componentDidMount() {
	}

	handleMouseMove = (e) => {
		const { annotationWidth, annotationHeight } = this.props;
		const { zoom, glassBorderWidth } = this.state;
		const w = this.glass.offsetWidth / 2;
		const h = this.glass.offsetHeight / 2;
		const bw = glassBorderWidth;
		let pos; let x; let
			y;
		/* prevent any other actions that may occur when moving over the image */
		// e.preventDefault();
		/* get the cursor's x and y positions: */
		pos = this.getCursorPos(e);
		x = pos.x;
		y = pos.y;
		/* prevent the magnifier glass from being positioned outside the image: */
		/* prevent the magnifier glass from being positioned outside the image: */
		if (x > annotationWidth - (w / zoom)) { x = annotationWidth - (w / zoom); }
		if (x < w / zoom) { x = w / zoom; }
		if (y > annotationHeight - (h / zoom)) { y = annotationHeight - (h / zoom); }
		if (y < h / zoom) { y = h / zoom; }
		/* set the position of the magnifier glass: */
		const glassLeft = `${x - w}px`;
		const glassTop = `${y - h}px`;
		/* display what the magnifier glass "sees": */
		const glassBackgroundPosition = `-${(x * zoom) - w + bw}px -${(y * zoom) - h + bw}px`;
		this.setState({ glassLeft, glassTop, glassBackgroundPosition });
	}

	getCursorPos = (e) => {
		let a; let x = 0; let
			y = 0;
		e = e || window.event;
		/* get the x and y positions of the image: */
		a = this.image.getBoundingClientRect();
		/* calculate the cursor's x and y coordinates, relative to the image: */
		x = e.pageX - a.left;
		y = e.pageY - a.top;
		/* consider any page scrolling: */
		x -= window.pageXOffset;
		y -= window.pageYOffset;
		return { x, y };
	}

	render() {
		const { annotationWidth, annotationHeight, url } = this.props;
		const {
			zoom, glassBorderWidth, glassBackgroundPosition, glassLeft, glassTop,
		} = this.state;

		return (
			<div>
						 <div
					className='glass'
					ref={ glass => this.glass = glass }
					onMouseMove={ this.handleMouseMove }
						 			style={ {
						left: glassLeft, top: glassTop, borderWidth: glassBorderWidth, backgroundPosition: glassBackgroundPosition, backgroundImage: `url("${url}")`, backgroundSize: `${annotationWidth * zoom}px ${annotationHeight * zoom}px`,
					} }
						 />
						 <img
					ref={ image => this.image = image }
						 			width={ annotationWidth }
						 		  className=''
					onLoad={ this.props.onImgLoad }
					src={ url }
					onMouseMove={ this.handleMouseMove }
						 />
			</div>
		);
	}
}
export default Image;
