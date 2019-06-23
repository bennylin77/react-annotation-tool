import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Form, Input } from 'reactstrap';
import TwoDimensionalImageContext from '../TwoDimensionalImage/twoDimensionalImageContext';
import OptionItem from './OptionItem/OptionItem.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './optionList.scss';

const OptionList = ({
	className,
	annotationName,
	ancestorIds,
	selectedOptionIds,
	level,
}) => {
	const [value, setValue] = useState('');
	const twoDimensionalImageContext = useContext(TwoDimensionalImageContext);
	const {
		entities: { options },
		isDynamicOptionsEnable,
		onOptionCustomizedInputFocus,
		onOptionCustomizedInputBlur,
		onOptionCustomizedFormSubmit,
	} = twoDimensionalImageContext;

	const parentId = ancestorIds[ancestorIds.length - 1];
	const itemListUI = options[parentId].options.map((optionId) => {
		const childrenOptionIds = options[optionId].options;
		const _ancestorIds = ancestorIds.slice();
		_ancestorIds.push(optionId);
		return (
			<OptionItem
				level={ level }
				ancestorIds={ _ancestorIds }
				optionId={ optionId }
				childrenOptionIds={ childrenOptionIds }
				annotationName={ annotationName }
				selectedOptionIds={ selectedOptionIds }
			/>
		);
	});

	const customizedOptionUI = isDynamicOptionsEnable ? (
		<ListGroupItem key={ `new-${parentId}` } style={ { paddingLeft: 30 * level } }>
			<Form inline onSubmit={ (e) => { onOptionCustomizedFormSubmit(e, parentId, value); } }>
				<Input
					className='mr-sm-2'
					type='text'
					name={ parentId }
					value={ value }
					onFocus={ onOptionCustomizedInputFocus }
					onBlur={ onOptionCustomizedInputBlur }
					onChange={ e => setValue(e.target.value) }
				/>
				<Input type='submit' value='Submit' className='my-2 my-sm-0' />
			</Form>
		</ListGroupItem>
	) : null;

	const rootClassName = `option-list${className ? ` ${className}` : ''}`;
	return (
		<ListGroup className={ rootClassName }>
			{ itemListUI }
			{ customizedOptionUI }
		</ListGroup>
	);
};

OptionList.propTypes = {
	className: PropTypes.string,
	annotationName: PropTypes.string,
	level: PropTypes.number,
	ancestorIds: PropTypes.arrayOf(PropTypes.string),
	selectedOptionIds: PropTypes.arrayOf(PropTypes.string),
};
OptionList.defaultProps = {
	className: '',
	annotationName: '',
	level: 1,
	ancestorIds: [],
	selectedOptionIds: [],
};
export default OptionList;
