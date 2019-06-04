import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'reactstrap';
import { Events, scrollSpy, scroller } from 'react-scroll';
import {
	isDialogDisabledConst,
	initialIsDialogDisabledState,
	isDialogDisabledReducer,
} from './isDialogDisabledReducer';
import AnnotationItem from './AnnotationItem/AnnotationItem.jsx';
import { getSortedAnnotationsByLabel } from '../../utils/utils';
import 'bootstrap/dist/css/bootstrap.css';
import './annotationList.scss';

const AnnotationList = ({
	className,
	focusing,
	height,
	entities,
	annotations,
}) => {
	const [isDialogDisabled, dispatchIsDialogDisabled] = useReducer(isDialogDisabledReducer, initialIsDialogDisabledState);

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
		scroller.scrollTo(focusing, { containerId: 'list-wrapper' });
	}, [focusing]);

	const sortedAnnotations = getSortedAnnotationsByLabel(annotations, entities);
	const itemsUI = sortedAnnotations
		.filter(ann => entities && entities.annotations[ann] && entities.annotations[ann].isManipulatable)
		.map(ann => (
			<AnnotationItem
				key={ ann }
				itemData={ entities.annotations[ann] }
				isDialogDisabledConst={ isDialogDisabledConst }
				isDialogDisabled={ isDialogDisabled }
				dispatchIsDialogDisabled={ dispatchIsDialogDisabled }
			/>
		));
	if (itemsUI.length === 0) {
		return (
			<div className='d-flex align-items-center justify-content-center' style={ { height: height - 60 } }>
				{'Click the button above to begin tracking a new cell'}
			</div>
		);
	}

	return (
		<div className={ className }>
			<ListGroup className='list-wrapper' id='list-wrapper' style={ { maxHeight: height - 60 } }>{itemsUI}</ListGroup>
		</div>
	);
};

AnnotationList.propTypes = {
	className: PropTypes.string,
	focusing: PropTypes.string,
	height: PropTypes.number,
	annotations: PropTypes.arrayOf(PropTypes.string),
	entities: PropTypes.shape({
		annotations: PropTypes.object,
	}),
};
AnnotationList.defaultProps = {
	className: '',
	focusing: '',
	height: 0,
	annotations: [],
	entities: {},
};
export default AnnotationList;
