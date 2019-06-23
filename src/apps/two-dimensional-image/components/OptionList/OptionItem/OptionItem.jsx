import React, { Fragment, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroupItem, Collapse } from 'reactstrap';
import { MdDelete } from 'react-icons/md';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import OptionList from '../OptionList.jsx';
import TwoDimensionalImageContext from '../../TwoDimensionalImage/twoDimensionalImageContext';

import 'bootstrap/dist/css/bootstrap.css';
import './optionItem.scss';

const OptionItem = ({
	className,
	level,
	ancestorIds,
	optionId,
	childrenOptionIds,
	annotationName,
	selectedOptionIds,
}) => {
	const [isChildrenOpen, setIsChildrenOpen] = useState(false);
	const twoDimensionalImageContext = useContext(TwoDimensionalImageContext);
	const {
		entities,
		isDynamicOptionsEnable,
		disabledOptionLevels,
		onOptionDeleteClick,
		onOptionSelect,
	} = twoDimensionalImageContext;

	const { options } = entities;
	const rootClassName = `option-item${className ? ` ${className}` : ''}`;

	let itemStyle = { paddingLeft: 30 * level };
	itemStyle = selectedOptionIds.length > 0 && optionId === selectedOptionIds[selectedOptionIds.length - 1].id ?
		{ ...itemStyle, background: '#e4e4e4' } :
		itemStyle;

	let chevronButtonUI = null;
	chevronButtonUI = (!isDynamicOptionsEnable && childrenOptionIds.length !== 0 && isChildrenOpen) || (isDynamicOptionsEnable && isChildrenOpen) ?
		<FaChevronDown /> :
		<FaChevronRight />;

	return (
		<Fragment>
			<ListGroupItem className={ rootClassName } style={ itemStyle }>
				<div className='d-flex align-items-center'>
					<Button
						color='link'
						className='d-flex align-items-center mr-auto pl-0 option-item__button'
						onClick={
							() => {
								setIsChildrenOpen(!isChildrenOpen);
								if (!disabledOptionLevels.includes(level)) onOptionSelect(annotationName, ancestorIds);
							}
						}
					>
						{chevronButtonUI}
						{options[optionId].value}
					</Button>
					{
						isDynamicOptionsEnable &&
                        <Button className='option-item__delete-button' color='link' onClick={ () => onOptionDeleteClick(ancestorIds) }><MdDelete /></Button>
					}
				</div>
			</ListGroupItem>
			<Collapse key={ `collapse-${optionId}` } isOpen={ isChildrenOpen }>
				<OptionList annotationName={ annotationName } ancestorIds={ ancestorIds } level={ level + 1 } selectedOptionIds={ selectedOptionIds } />
			</Collapse>
		</Fragment>
	);
};

OptionItem.propTypes = {
	className: PropTypes.string,
	annotationName: PropTypes.string,
	optionId: PropTypes.string,
	level: PropTypes.number,
	ancestorIds: PropTypes.arrayOf(PropTypes.string),
	selectedOptionIds: PropTypes.arrayOf(PropTypes.string),
	childrenOptionIds: PropTypes.arrayOf(PropTypes.string),
};
OptionItem.defaultProps = {
	className: '',
	annotationName: '',
	optionId: '',
	level: 1,
	ancestorIds: [],
	selectedOptionIds: [],
	childrenOptionIds: [],
};
export default OptionItem;
