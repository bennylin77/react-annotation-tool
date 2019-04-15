import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import {
	Form, FormGroup, Input, Button, Label,
} from 'reactstrap';

import { MdDelete } from 'react-icons/md';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/Options.css';

class Options extends Component {
	constructor(props) {
		super(props);
		this.state = { collapse: {}, values: {} };
	}

	handleSelect = (id, annotationName, selectedIds, canBeSelected) => {
		this.setState(prevState => ({ collapse: { ...prevState.collapse, [id]: !prevState.collapse[id] } }), () => {
			if (canBeSelected) this.props.onSelectOption(annotationName, selectedIds);
		});
	}

	handleInputChange = (id, e) => {
		const { target } = e;
		this.setState(prevState => ({ values: { ...prevState.values, [id]: target.value } }));
	}

	buildList = (ancestorIds, level = 1) => {
		const {
			selected, annotationName, dynamicOptions, disabledLevels, entities: { options },
		} = this.props;
		const { values } = this.state;
		const items = [];
		const parentId = ancestorIds[ancestorIds.length - 1];
		for (const i of options[parentId].options) {
			const children = options[i].options;
			const _ancestorIds = ancestorIds.slice(); // copy an new array
			_ancestorIds.push(i);
			const itemStyle = { paddingLeft: 30 * level };
			const childrenItem = this.buildList(_ancestorIds, level + 1);
			if (selected.length > 0 && i === selected[selected.length - 1].id) itemStyle = { ...itemStyle, background: '#e4e4e4' };
			items.push(<ListGroupItem key={ i } style={ itemStyle }>
				<div className='d-flex align-items-center'>
					<div className='d-flex align-items-center option-list-collapse-button mr-auto' onClick={ () => { this.handleSelect(i, annotationName, _ancestorIds, !disabledLevels.includes(level)); } }>
						{ !dynamicOptions && children.length !== 0 && this.state.collapse[i] && <FaChevronDown /> || dynamicOptions && this.state.collapse[i] && <FaChevronDown />}
						{ !dynamicOptions && children.length !== 0 && !this.state.collapse[i] && <FaChevronRight /> || dynamicOptions && !this.state.collapse[i] && <FaChevronRight />}
						{options[i].value}
					</div>
					{ dynamicOptions && <Button className='option-item-delete' color='link' onClick={ () => this.props.onDeleteOption(_ancestorIds) }><MdDelete /></Button> }
				</div>
			</ListGroupItem>);
			items.push(<Collapse key={ `collapse-${i}` } isOpen={ this.state.collapse[i] }>{childrenItem}</Collapse>);
		}


		if (dynamicOptions) {
			const form = (
				<ListGroupItem key={ `new-${parentId}` } style={ { paddingLeft: 30 * level } }>
										 <Form inline onSubmit={ (e) => { this.props.onAddOption(e, parentId, values[parentId]); } }>
											 <Input className='mr-sm-2' type='text' name={ parentId } value={ values[parentId] } onFocus={ this.props.onInputFocus } onBlur={ this.props.onInputBlur } onChange={ e => this.handleInputChange(parentId, e) } />
						<Input type='submit' value='Submit' className='my-2 my-sm-0' />
										 </Form>
				</ListGroupItem>
			);
			items.push(form);
		}
		return <ListGroup className='option-list-ul'>{items}</ListGroup>;
	}

	render() {
		const { optionRoot } = this.props;
		const list = this.buildList([optionRoot]);
		return (
			<div>
				{list}
			</div>
		);
	}
}
export default Options;
