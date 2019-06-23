import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroupItem } from 'reactstrap';
import { MdDelete } from 'react-icons/md';
import TwoDimensionalImageContext from '../../TwoDimensionalImage/twoDimensionalImageContext';
import OptionList from '../../OptionList/OptionList.jsx';
import './annotationItem.scss';

const AnnotationItem = ({
	className,
	itemData,
}) => {
	const twoDimensionalImageContext = useContext(TwoDimensionalImageContext);
	const {
		focusing,
		onAnnotationClick,
		onAnnotationDeleteClick,
		optionRoot,
	} = twoDimensionalImageContext;
	const {
		name,
		selected: selectedOptionIds,
		color,
		closed,
	} = itemData;

	let rootClassName = `annotation-item${className ? ` ${className}` : ''}`;
	if (name !== focusing) {
		return (
			<ListGroupItem className={ rootClassName } name={ name } onClick={ () => onAnnotationClick(name) } action>
				<div className='d-flex w-100 justify-content-between align-items-center'>
					<div>
						{selectedOptionIds.length > 0 ? `${selectedOptionIds[selectedOptionIds.length - 1].value}` : 'Not selected' }
						<small className='pl-1' style={ { color: '#545454' } }><mark>{closed ? 'polygon' : 'line'}</mark></small>
					</div>
				</div>
			</ListGroupItem>
		);
	}

	rootClassName = `${rootClassName} annotation-item--highlight`;
	return (
		<ListGroupItem className={ rootClassName } name={ name } style={ { borderColor: color.replace(/,1\)/, ',.3)') } }>
			<div className='d-flex align-items-center'>
				<h5 className='annotation-item__title mr-auto'>
					{selectedOptionIds.length > 0 ? `${selectedOptionIds[selectedOptionIds.length - 1].value}` : 'Not selected' }
					<small className='pl-1' style={ { color: '#545454' } }><mark>{closed ? 'polygon' : 'line'}</mark></small>
				</h5>
				<Button className='d-flex align-items-center annotation-item__delete-button' color='link' onClick={ () => { onAnnotationDeleteClick(name); } }>
					<MdDelete />
				</Button>
			</div>
			<OptionList annotationName={ name } ancestorOptionIds={ [optionRoot] } selectedOptionIds={ selectedOptionIds } />
		</ListGroupItem>
	);
};

AnnotationItem.propTypes = {
	className: PropTypes.string,
    itemData: PropTypes.object,
};
AnnotationItem.defaultProps = {
	className: '',
	itemData: {},
};
export default AnnotationItem;
