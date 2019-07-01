import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Events, scrollSpy, scroller } from 'react-scroll';
import { ListGroup } from 'reactstrap';
import TwoDimensionalImageContext from '../TwoDimensionalImage/twoDimensionalImageContext';
import AnnotationItem from './AnnotationItem/AnnotationItem.jsx';
import './annotationList.scss';

const AnnotationList = ({
	className,
}) => {
	const twoDimensionalImageContext = useContext(TwoDimensionalImageContext);
	const {
		entities,
		annotations,
		height,
		focusedName,
		emptyAnnotationReminderText,
	} = twoDimensionalImageContext;
	useEffect(() => {
		Events.scrollEvent.register('begin', () => {});
		Events.scrollEvent.register('end', () => {});
		scrollSpy.update();
		return () => {
			Events.scrollEvent.remove('begin');
			Events.scrollEvent.remove('end');
		};
	});
	useEffect(() => {
		if (focusedName) {
			scroller.scrollTo(focusedName, { containerId: 'annotation-list' });
		}
	}, [focusedName]);


	const itemsUI = annotations.map(ann => (
		<AnnotationItem
			key={ ann }
			itemData={ entities.annotations[ann] }
		/>
	));

	if (itemsUI.length === 0) {
		return (
			<div className='d-flex align-items-center justify-content-center' style={ { height } }>
				{emptyAnnotationReminderText}
			</div>
		);
	}
	const rootClassName = `annotation-list${className ? ` ${className}` : ''}`;
	return (
		<ListGroup className={ rootClassName } id='annotation-list' style={ { maxHeight: height } }>{itemsUI}</ListGroup>
	);
};

AnnotationList.propTypes = {
	className: PropTypes.string,
};
AnnotationList.defaultProps = {
	className: '',
};
export default AnnotationList;
