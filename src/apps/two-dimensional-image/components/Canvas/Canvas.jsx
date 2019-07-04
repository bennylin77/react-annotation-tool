import React, { useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
	Stage, Layer, Rect, Group, Line, Text, Circle, Image, Label, Tag,
} from 'react-konva';
import TwoDimensionalImageContext from '../TwoDimensionalImage/twoDimensionalImageContext';
import './canvas.scss';


const CONST = {
	DOT_LENGTH: 5,
	MAGNIFIER_LENGTH: 200,
};

const handleMouseLeave = (isAdding) => {
	document.body.style.cursor = isAdding ? 'crosshair' : 'default';
};

const handleMouseOut = (isAdding) => {
	document.body.style.cursor = isAdding ? 'crosshair' : 'default';
};

const handleMouseOver = (isAdding) => {
	if (isAdding) return;
	document.body.style.cursor = 'pointer';
};

const handleFirstVertexMouseOver = () => {
	document.body.style.cursor = 'cell';
};

const handleVertexMouseOver = () => {
	document.body.style.cursor = 'move';
};

const handleVertexDragMove = (e, isAdding, entities) => {
	if (isAdding) return;
	document.body.style.cursor = 'move';
	const activeVertex = e.target;
	const group = activeVertex.getParent();
	const line = group.get('Line')[0];
	const linePoints = [];
	entities.annotations[group.name()].vertices.forEach((v) => {
		if (v.name !== activeVertex.name()) {
			linePoints.push(v.x); linePoints.push(v.y);
			return;
		}
		linePoints.push(activeVertex.x()); linePoints.push(activeVertex.y());
	});
	line.points(linePoints);
};

const Canvas = ({
	className,
}) => {
	const imgRef = useRef(null);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const twoDimensionalImageContext = useContext(TwoDimensionalImageContext);
	const {
		url,
		width,
		height,
		annotations,
		entities,
		magnifyingPower,
		isLabelOn,
		isAdding,
		focusedName,
		onCanvasImgLoad: onImgLoad,
		onCanvasStageMouseDown: onStageMouseDown,
		onCanvasVertexMouseDown: onVertexMouseDown,
		onCanvasVertexDragEnd: onVertexDragEnd,
		onCanvasLabelMouseDown: onLabelMouseDown,
		onCanvasLineMouseDown: onLineMouseDown,
	} = twoDimensionalImageContext;

	const annotationsUI = annotations.map((annotationId) => {
		const { color, name, selectedOptions, isClosed, vertices } = entities.annotations[annotationId];
		const colorWithOpacity = color.replace(/,1\)/, ',.15)');

		const verticesUI = [];
		const linePoints = [];
		const startPoint = {};
		vertices.forEach((v, i) => {
			if (i === 0) {
				startPoint.x = v.x; startPoint.y = v.y;
			}
			if (isAdding && focusedName === name && i === 0) {
				verticesUI.push(
					<Circle
						x={ v.x }
						y={ v.y }
						key={ v.name }
						name={ v.name }
						radius={ CONST.DOT_LENGTH * 1.1 }
						stroke={ color }
						fill={ colorWithOpacity }
						strokeWidth={ 1 }
						draggable
						dragOnTop={ false }
						onMouseDown={ onVertexMouseDown }
						onMouseOver={ handleFirstVertexMouseOver }
						onMouseOut={ () => handleMouseOut(isAdding) }
						onFocus={ () => {} }
						onBlur={ () => {} }
					/>,
				);
			} else {
				verticesUI.push(
					<Rect
						offsetX={ CONST.DOT_LENGTH / 2 }
						offsetY={ CONST.DOT_LENGTH / 2 }
						x={ v.x }
						y={ v.y }
						key={ v.name }
						name={ v.name }
						stroke={ color }
						fill={ color }
						strokeWidth={ 0 }
						width={ CONST.DOT_LENGTH }
						height={ CONST.DOT_LENGTH }
						draggable
						dragOnTop={ false }
						onMouseDown={ onVertexMouseDown }
						onMouseOver={ handleVertexMouseOver }
						onMouseOut={ () => handleMouseOut(isAdding) }
						onDragEnd={ onVertexDragEnd }
						onDragMove={ e => handleVertexDragMove(e, isAdding, entities) }
						onFocus={ () => {} }
						onBlur={ () => {} }
					/>,
				);
			}
			linePoints.push(v.x); linePoints.push(v.y);
		});

		const labelUI = isLabelOn ? (
			<Label
				offsetY={ 10 }
				x={ startPoint.x }
				y={ startPoint.y }
				onMouseDown={ onLabelMouseDown }
				onMouseOver={ () => handleMouseOver(isAdding) }
				onMouseLeave={ () => handleMouseLeave(isAdding) }
				onMouseOut={ () => handleMouseOut(isAdding) }
				onFocus={ () => {} }
				onBlur={ () => {} }
			>
				<Tag
					name={ name }
					fill='#000'
					opacity={ 0.4 }
					pointerDirection='down'
					pointerWidth={ 10 }
					pointerHeight={ 10 }
					lineJoin='round'
					cornerRadius={ 7 }
				/>
				<Text
					name={ name }
					padding={ 5 }
					fontFamily='Calibri'
					text={ selectedOptions.length > 0 ? `${selectedOptions[selectedOptions.length - 1].value}` : 'Not selected' }
					fontSize={ 16 }
					lineHeight={ 1.2 }
					fill='#fff'
				/>
			</Label>
		) : null;
		const lineUI = (
			<Line
				name={ name }
				points={ linePoints }
				closed={ isClosed }
				fill={ focusedName === name ? colorWithOpacity : '' }
				stroke={ color }
				strokeWidth={ 1 }
				lineCap='round'
				lineJoin='round'
				onMouseDown={ onLineMouseDown }
				onMouseOver={ () => handleMouseOver(isAdding) }
				onMouseLeave={ () => handleMouseLeave(isAdding) }
				onMouseOut={ () => handleMouseOut(isAdding) }
				onFocus={ () => {} }
				onBlur={ () => {} }
			/>
		);
		return (
			<Group key={ name } name={ name }>
				{lineUI}
				{verticesUI}
				{labelUI}
			</Group>
		);
	});

	const normalizedLength = CONST.MAGNIFIER_LENGTH / magnifyingPower;
	const rootClassName = `canvas${className ? ` ${className}` : ''}`;
	return (
		<div className={ rootClassName }>
			<img
				className='canvas__img'
				ref={ imgRef }
				width={ width }
				style={ { visibility: 'hidden' } }
				onLoad={ onImgLoad }
				src={ url }
				alt=''
			/>
			<Stage
				className='konva-wrapper'
				width={ width }
				height={ height }
				onMouseDown={ onStageMouseDown }
				onMouseMove={ (e) => {
					const stage = e.target.getStage();
					const position = stage.getPointerPosition();
					setCursorPosition({ x: position.x, y: position.y });
				} }
				onFocus={ () => {} }
			>
				<Layer>
					<Image image={ imgRef.current } width={ width } height={ height } />
					{annotationsUI}
				</Layer>
				{ magnifyingPower > 1 && (
					<Layer>
						<Group>
							<Rect
								x={ cursorPosition.x }
								y={ cursorPosition.y }
								offsetX={ normalizedLength * magnifyingPower / 2 }
								offsetY={ normalizedLength * magnifyingPower / 2 }
								width={ normalizedLength * magnifyingPower }
								height={ normalizedLength * magnifyingPower }
								stroke='#b5b5b5'
								strokeWidth={ 5 }
							/>
							<Group
								x={ cursorPosition.x }
								y={ cursorPosition.y }
								offsetX={ cursorPosition.x }
								offsetY={ cursorPosition.y }
								clipX={ cursorPosition.x - normalizedLength / 2 }
								clipY={ cursorPosition.y - normalizedLength / 2 }
								clipWidth={ normalizedLength }
								clipHeight={ normalizedLength }
								scaleX={ magnifyingPower }
								scaleY={ magnifyingPower }
							>
								<Image image={ imgRef.current } width={ width } height={ height } />
								{annotationsUI}
							</Group>
						</Group>
					</Layer>
				)}
			</Stage>

		</div>
	);
};

Canvas.propTypes = {
	className: PropTypes.string,
};
Canvas.defaultProps = {
	className: '',
};

export default Canvas;
