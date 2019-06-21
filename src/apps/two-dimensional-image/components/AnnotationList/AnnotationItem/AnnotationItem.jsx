import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroupItem } from 'reactstrap';
import { MdDelete } from 'react-icons/md';
import TwoDimensionalImageContext from '../../TwoDimensionalImage/twoDimensionalImageContext';
import Options from '../../Tmp/Options';
import './annotationItem.scss';

const AnnotationItem = ({
	className,
	itemData,
}) => {
	const twoDimensionalImageContext = useContext(TwoDimensionalImageContext);
	const {
		focusing,
		onAnnotationItemClick,
		onAnnotationDeleteClick,

		entities,
		dynamicOptions,
		disabledOptionLevels,
		optionRoot,
		onOptionsInputFocus,
		onOptionsInputBlur,
		onOptionsAddOption,
		onOptionsSelectOption,
		onOptionsDeleteOption,

	} = twoDimensionalImageContext;
	const {
		name,
		selected,
		color,
		closed,
	} = itemData;

	let rootClassName = `annotation-item${className ? ` ${className}` : ''}`;
	if (name !== focusing) {
		return (
			<ListGroupItem className={ rootClassName } name={ name } onClick={ () => onAnnotationItemClick(name) } action>
				<div className='d-flex w-100 justify-content-between align-items-center'>
					<div>
						{selected.length > 0 ? `${selected[selected.length - 1].value}` : 'Not selected' }
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
					{selected.length > 0 ? `${selected[selected.length - 1].value}` : 'Not selected' }
					<small className='pl-1' style={ { color: '#545454' } }><mark>{closed ? 'polygon' : 'line'}</mark></small>
				</h5>
				<Button className='d-flex align-items-center annotation-item__delete-button' color='link' onClick={ () => { onAnnotationDeleteClick(name); } }>
					<MdDelete />
				</Button>
			</div>
			<Options
				dynamicOptions={ dynamicOptions }
				disabledLevels={ disabledOptionLevels }
				entities={ entities }
				optionRoot={ optionRoot }
				selected={ selected }
				annotationName={ name }
				onInputFocus={ onOptionsInputFocus }
				onInputBlur={ onOptionsInputBlur }
				onAddOption={ onOptionsAddOption }
				onSelectOption={ onOptionsSelectOption }
				onDeleteOption={ onOptionsDeleteOption }
			/>
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
