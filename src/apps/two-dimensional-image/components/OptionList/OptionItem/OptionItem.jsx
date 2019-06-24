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
	ancestorOptionIds,
	optionId,
	childrenOptionIds,
	annotationName,
	selectedOptions,
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
	itemStyle = selectedOptions.length > 0 && optionId === selectedOptions[selectedOptions.length - 1].id ?
		{ ...itemStyle, background: '#e4e4e4' } :
		itemStyle;

	let chevronButtonUI = null;
	if ((!isDynamicOptionsEnable && childrenOptionIds.length !== 0) || isDynamicOptionsEnable) {
		chevronButtonUI = isChildrenOpen ? <FaChevronDown /> : <FaChevronRight />;
	}

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
								if (!disabledOptionLevels.includes(level)) onOptionSelect(annotationName, ancestorOptionIds);
							}
						}
					>
						{options[optionId].value}
						{chevronButtonUI}
					</Button>
					{
						isDynamicOptionsEnable && (
							<Button className='option-item__delete-button' color='link' onClick={ () => onOptionDeleteClick(ancestorOptionIds) }>
								<MdDelete />
							</Button>
						)
					}
				</div>
			</ListGroupItem>
			<Collapse key={ `collapse-${optionId}` } isOpen={ isChildrenOpen }>
				<OptionList
					annotationName={ annotationName }
					ancestorOptionIds={ ancestorOptionIds }
					level={ level + 1 }
					selectedOptions={ selectedOptions }
				/>
			</Collapse>
		</Fragment>
	);
};

OptionItem.propTypes = {
	className: PropTypes.string,
	annotationName: PropTypes.string,
	optionId: PropTypes.string,
	level: PropTypes.number,
	selectedOptions: PropTypes.arrayOf(PropTypes.object),
	ancestorOptionIds: PropTypes.arrayOf(PropTypes.string),
	childrenOptionIds: PropTypes.arrayOf(PropTypes.string),
};
OptionItem.defaultProps = {
	className: '',
	annotationName: '',
	optionId: '',
	level: 1,
	selectedOptions: [],
	ancestorOptionIds: [],
	childrenOptionIds: [],
};
export default OptionItem;
