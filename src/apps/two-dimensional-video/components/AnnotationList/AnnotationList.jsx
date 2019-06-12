import React, { useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'reactstrap';
import { Events, scrollSpy, scroller } from 'react-scroll';
import {
	initialIsDialogDisabledState,
	isDialogDisabledReducer,
} from './isDialogDisabledReducer';
import AnnotationItem from './AnnotationItem/AnnotationItem.jsx';
import TwoDimensionalVideoContext from '../TwoDimensionalVideo/twoDimensionalVideoContext';
import { getSortedAnnotationsByLabel } from '../../utils/utils';
import 'bootstrap/dist/css/bootstrap.css';
import './annotationList.scss';

const AnnotationList = ({ className }) => {
	const [isDialogDisabled, dispatchIsDialogDisabled] = useReducer(isDialogDisabledReducer, initialIsDialogDisabledState);
	const twoDimensionalVideoContext = useContext(TwoDimensionalVideoContext);
	const {
		entities,
		focusing,
		annotations,
		height,
		emptyAnnotationReminderText,
	} = twoDimensionalVideoContext;

	useEffect(() => {
		Events.scrollEvent.register('begin', () => {});
		Events.scrollEvent.register('end', () => {});
		scrollSpy.update();
		return () => {
			Events.scrollEvent.remove('begin');
			Events.scrollEvent.remove('end');
		};
	}, []);

	useEffect(() => {
		if (focusing) {
			scroller.scrollTo(focusing, { containerId: 'annotation-list' });
		}
	}, [focusing]);

	const sortedAnnotations = getSortedAnnotationsByLabel(annotations, entities);
	const itemsUI = sortedAnnotations
		.filter(ann => entities && entities.annotations[ann] && entities.annotations[ann].isManipulatable)
		.map(ann => (
			<AnnotationItem
				key={ ann }
				itemData={ entities.annotations[ann] }
				isDialogDisabled={ isDialogDisabled }
				dispatchIsDialogDisabled={ dispatchIsDialogDisabled }
			/>
		));
	if (itemsUI.length === 0) {
		return (
			<div className='d-flex align-items-center justify-content-center' style={ { height: height - 60 } }>
				{emptyAnnotationReminderText}
			</div>
		);
	}

	const rootClassName = `annotation-list${className ? ` ${className}` : ''}`;
	return (
		<ListGroup className={ rootClassName } id='annotation-list' style={ { maxHeight: height - 60 } }>{itemsUI}</ListGroup>
	);
};

AnnotationList.propTypes = {
	className: PropTypes.string,
};
AnnotationList.defaultProps = {
	className: '',
};
export default AnnotationList;
