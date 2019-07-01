import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
		focusedName,
		onAnnotationClick,
		onAnnotationDeleteClick,
		rootOptionId,
	} = twoDimensionalImageContext;
	const {
		name,
		selectedOptions,
		color,
		isClosed,
	} = itemData;
	const { t } = useTranslation('twoDimensionalImage');

	let rootClassName = `annotation-item${className ? ` ${className}` : ''}`;
	if (name !== focusedName) {
		return (
			<ListGroupItem className={ rootClassName } name={ name } onClick={ () => onAnnotationClick(name) } action>
				<div className='d-flex w-100 justify-content-between align-items-center'>
					<div>
						{selectedOptions.length > 0 ? `${selectedOptions[selectedOptions.length - 1].value}` : t('optionNotSelected') }
						<small className='pl-1' style={ { color: '#545454' } }><mark>{isClosed ? 'polygon' : 'line'}</mark></small>
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
					{selectedOptions.length > 0 ? `${selectedOptions[selectedOptions.length - 1].value}` : t('optionNotSelected') }
					<small className='pl-1' style={ { color: '#545454' } }><mark>{isClosed ? 'polygon' : 'line'}</mark></small>
				</h5>
				<Button className='d-flex align-items-center annotation-item__delete-button' color='link' onClick={ () => { onAnnotationDeleteClick(name); } }>
					<MdDelete />
				</Button>
			</div>
			<OptionList annotationName={ name } ancestorOptionIds={ [rootOptionId] } selectedOptions={ selectedOptions } />
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
