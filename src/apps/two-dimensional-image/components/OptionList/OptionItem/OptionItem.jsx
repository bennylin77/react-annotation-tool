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
    itemStyle,
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
	return (
		<Fragment>
			<ListGroupItem className={ rootClassName } style={ itemStyle }>
				<div className='d-flex align-items-center'>
					<Button
						className='d-flex align-items-center option-list-collapse-button mr-auto'
						onClick={
							() => {
								setIsChildrenOpen(!isChildrenOpen);
								if (!disabledOptionLevels.includes(level)) onOptionSelect(annotationName, ancestorIds);
							}
						}
					>
						{
							!isDynamicOptionsEnable && children.length !== 0 && isChildrenOpen && <FaChevronDown /> ||
                            isDynamicOptionsEnable && isChildrenOpen && <FaChevronDown />
						}
						{
							!isDynamicOptionsEnable && children.length !== 0 && !isChildrenOpen && <FaChevronRight /> ||
                            isDynamicOptionsEnable && !isChildrenOpen && <FaChevronRight />}
						{
							options[optionId].value
						}
					</Button>
					{
						isDynamicOptionsEnable &&
                        <Button className='option-item-delete' color='link' onClick={ () => onOptionDeleteClick(ancestorIds) }><MdDelete /></Button>
					}
				</div>
			</ListGroupItem>
			<Collapse key={ `collapse-${optionId}` } isOpen={ isChildrenOpen }>
				<OptionList annotationName={ annotationName } ancestorIds={ ancestorIds } level={ level + 1 } selectedOptionIds={ selectedOptionIds }/>
			</Collapse>
		</Fragment>
	);
};

OptionItem.propTypes = {
	className: PropTypes.string,
};
OptionItem.defaultProps = {
	className: '',
};
export default OptionItem;
