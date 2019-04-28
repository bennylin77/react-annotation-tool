import React from 'react';
import PropTypes from 'prop-types';
import { Rect } from 'react-konva';


const handleMouseOver = (e, isManipulatable) => {
	if (!isManipulatable) return;
	const activeAnchor = e.target;
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
	default:
		break;
	}
};

const handleMouseDown = (e, isManipulatable, onMouseDown) => {
	if (!isManipulatable) return;
	const group = e.target.findAncestor('Group');
	group.draggable(false);
	group.moveToTop();
	e.target.moveToTop();
	onMouseDown(e);
};

const handleDragMove = (e, canvasWidth, canvasHeight) => {
	const activeAnchor = e.target;
	const group = activeAnchor.getParent();
	const topLeft = group.get('.topLeft')[0]; const topRight = group.get('.topRight')[0]; const bottomRight = group.get('.bottomRight')[0]; const bottomLeft = group.get('.bottomLeft')[0];
	const top = group.get('.top')[0]; const left = group.get('.left')[0]; const right = group.get('.right')[0]; const bottom = group.get('.bottom')[0];
	const rect = group.get('Rect')[0];
	const text = group.get('Text')[0];
	let resizedWidth; let resizedHeight;
	// set box resizing boundary
	let absX = activeAnchor.getAbsolutePosition().x;
	let absY = activeAnchor.getAbsolutePosition().y;
	absX = absX < 0 ? 0 : absX;
	absY = absY < 0 ? 0 : absY;
	absX = absX > canvasWidth ? canvasWidth : absX;
	absY = absY > canvasHeight ? canvasHeight : absY;
	activeAnchor.setAbsolutePosition({ x: absX, y: absY });
	const anchorX = activeAnchor.getX();
	const anchorY = activeAnchor.getY();
	// update anchor positions
	switch (activeAnchor.getName()) {
	case 'topLeft':
		topRight.y(anchorY); top.y(anchorY); bottomLeft.x(anchorX); left.x(anchorX);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		top.x(anchorX + resizedWidth / 2); left.y(anchorY + resizedHeight / 2); right.y(anchorY + resizedHeight / 2); bottom.x(anchorX + resizedWidth / 2);
		text.x(anchorX); text.y(anchorY);
		break;
	case 'topRight':
		topLeft.y(anchorY); top.y(anchorY); bottomRight.x(anchorX); right.x(anchorX);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		top.x(anchorX - resizedWidth / 2); left.y(anchorY + resizedHeight / 2); right.y(anchorY + resizedHeight / 2); bottom.x(anchorX - resizedWidth / 2);
		text.y(anchorY); text.x(anchorX - resizedWidth);
		break;
	case 'bottomRight':
		bottomLeft.y(anchorY); bottom.y(anchorY); topRight.x(anchorX); right.x(anchorX);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		top.x(anchorX - resizedWidth / 2); left.y(anchorY - resizedHeight / 2); right.y(anchorY - resizedHeight / 2); bottom.x(anchorX - resizedWidth / 2);
		text.x(anchorX - resizedWidth);
		break;
	case 'bottomLeft':
		bottomRight.y(anchorY); bottom.y(anchorY); topLeft.x(anchorX); left.x(anchorX);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		top.x(anchorX + resizedWidth / 2); left.y(anchorY - resizedHeight / 2); right.y(anchorY - resizedHeight / 2); bottom.x(anchorX + resizedWidth / 2);
		text.x(anchorX);
		break;
	case 'top':
		topLeft.y(anchorY); topRight.y(anchorY);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		top.x(topLeft.x() + resizedWidth / 2);
		left.y(anchorY + resizedHeight / 2); right.y(anchorY + resizedHeight / 2);
		text.y(anchorY);
		break;
	case 'left':
		topLeft.x(anchorX); bottomLeft.x(anchorX);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		left.y(topLeft.y() + resizedHeight / 2);
		top.x(anchorX + resizedWidth / 2); bottom.x(anchorX + resizedWidth / 2);
		text.x(anchorX);
		break;
	case 'right':
		topRight.x(anchorX); bottomRight.x(anchorX);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		right.y(topLeft.y() + resizedHeight / 2);
		top.x(anchorX - resizedWidth / 2); bottom.x(anchorX - resizedWidth / 2);
		text.x(anchorX - resizedWidth);
		break;
	case 'bottom':
		bottomLeft.y(anchorY); bottomRight.y(anchorY);
		resizedHeight = bottomRight.y() - topLeft.y();
		resizedWidth = bottomRight.x() - topLeft.x();
		bottom.x(topLeft.x() + resizedWidth / 2);
		left.y(anchorY - resizedHeight / 2); right.y(anchorY - resizedHeight / 2);
		break;
	default:
		break;
	}
	group.x(topLeft.getAbsolutePosition().x);
	group.y(topLeft.getAbsolutePosition().y);
	topLeft.position({ x: 0, y: 0 });
	top.position({ x: resizedWidth / 2, y: 0 });
	topRight.position({ x: resizedWidth, y: 0 });
	left.position({ x: 0, y: resizedHeight / 2 });
	bottomLeft.position({ x: 0, y: resizedHeight });
	right.position({ x: resizedWidth, y: resizedHeight / 2 });
	bottom.position({ x: resizedWidth / 2, y: resizedHeight });
	bottomRight.position({ x: resizedWidth, y: resizedHeight });
	rect.position(topLeft.position());
	rect.width(resizedWidth);
	rect.height(resizedHeight);
	text.position({ x: 0, y: 0 });
};

const ResizingAnchor = ({
	dotLength,
	color,
	isManipulatable,
	x,
	y,
	name,
	onDragEnd,
	onMouseDown,
	canvasWidth,
	canvasHeight,
}) => (
	<Rect
		offsetX={ dotLength / 2 }
		offsetY={ dotLength / 2 }
		x={ x }
		y={ y }
		key={ name }
		name={ name }
		stroke={ color }
		fill={ color }
		strokeWidth={ 0 }
		width={ dotLength }
		height={ dotLength }
		draggable={ isManipulatable }
		dragOnTop={ false }
		onDragMove={ e => handleDragMove(e, canvasWidth, canvasHeight) }
		onMouseDown={ e => handleMouseDown(e, isManipulatable, onMouseDown) }
		onDragEnd={ (e) => {
			document.body.style.cursor = 'default';
			onDragEnd(e);
		} }
		onMouseOver={ e => handleMouseOver(e, isManipulatable) }
		onMouseOut={ () => {
			document.body.style.cursor = 'default';
		} }
		onFocus={ () => {} }
		onBlur={ () => {} }
	/>
);

ResizingAnchor.propTypes = {
	dotLength: PropTypes.number,
	color: PropTypes.string,
	canvasWidth: PropTypes.number,
	canvasHeight: PropTypes.number,
	isManipulatable: PropTypes.bool,
	x: PropTypes.number,
	y: PropTypes.number,
	name: PropTypes.string,
	onDragEnd: PropTypes.func,
	onMouseDown: PropTypes.func,
};
ResizingAnchor.defaultProps = {
	dotLength: 6,
	color: '#fff',
	canvasWidth: 0,
	canvasHeight: 0,
	isManipulatable: true,
	x: 0,
	y: 0,
	name: '',
	onDragEnd: () => {},
	onMouseDown: () => {},
};
export default ResizingAnchor;
