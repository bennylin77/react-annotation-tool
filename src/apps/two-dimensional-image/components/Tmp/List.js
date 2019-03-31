import React, {Component} from 'react';
import Duration from './Duration'
import Options from './Options'
import {Rounding} from './helper.js'
import 'bootstrap/dist/css/bootstrap.css';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Collapse} from 'reactstrap';
import { Events, scrollSpy, scroller} from 'react-scroll'
import {MdDelete, MdAdd, MdHighlightRemove} from 'react-icons/md';
import {FaChevronDown, FaChevronUp, FaArrowDown} from 'react-icons/fa';
import {IoEyeDisabled, IoEye} from 'react-icons/io';



import './styles/List.css';

class List extends Component {

	constructor(props){
		super(props)
	}
	componentDidMount = () =>{
    Events.scrollEvent.register('begin', (to, element) => {});
    Events.scrollEvent.register('end', (to, element) => {});
    scrollSpy.update();
  }
	componentWillUnmount = () =>{
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }
	componentDidUpdate = (prevProps) => {
		const { focusing } = this.props;
	  if ( focusing && focusing !== prevProps.focusing) {
	    scroller.scrollTo(focusing, {containerId: 'list-wrapper'});
	  }
  }


  render() {
		const { annotations, focusing, dynamicOptions, disabledOptionLevels, entities, optionRoot, height } = this.props;
		const items = [];
		annotations.forEach( ann =>{
			const selected = entities.annotations[ann].selected
			const color = entities.annotations[ann].color
			const closed = entities.annotations[ann].closed
			if(ann === focusing)
				items.unshift(<ListGroupItem className="object-item object-item-highlight" key={ann} name={ann} style={{borderColor: color.replace(/,1\)/, ",.3)")}}>
														  <div className="d-flex align-items-center">
																<h5 className="object-item-title mr-auto">{selected.length>0?`${selected[selected.length-1].value}` : "Not selected" }<small className="pl-1" style={{color: "#545454"}}><mark>{closed? "polygon":"line"}</mark></small></h5>
																<Button className="d-flex align-items-center object-item-delete" color="link" onClick={()=>{this.props.onListItemDelete(ann)}}><MdDelete/></Button>
															</div>
															<Options dynamicOptions={dynamicOptions}
																			 disabledLevels={disabledOptionLevels}
																			 entities = {entities}
																			 optionRoot = {optionRoot}
																			 selected = {selected}
																			 annotationName = {ann}
																			 onInputFocus={this.props.onOptionsInputFocus}
																			 onInputBlur={this.props.onOptionsInputBlur}
																			 onAddOption={this.props.onOptionsAddOption}
																			 onSelectOption={this.props.onOptionsSelectOption}
																			 onDeleteOption={this.props.onOptionsDeleteOption} />
											</ListGroupItem>)
			else
				items.unshift(<ListGroupItem className="object-item" key={ann} name={ann} onClick={()=>this.props.onListItemClick(ann)} action>
													 <div className="d-flex w-100 justify-content-between align-items-center">
															<div>{selected.length>0?`${selected[selected.length-1].value}` : "Not selected" }<small className="pl-1" style={{color: "#545454"}}><mark>{closed? "polygon":"line"}</mark></small></div>
													 </div>
										  </ListGroupItem>)
		})

		if(items.length ==0)
			return (<div className="d-flex align-items-center justify-content-center" style={{height: height}}>Click <Button disabled outline color="primary" className="d-flex align-items-center explanation-add-button"><MdAdd/> Add Annotation</Button> above to add an annotation</div>)
    return (
			<div>
				<ListGroup className="list-wrapper" id="list-wrapper" style={{maxHeight: height}}>{items}</ListGroup>
			</div>
		);
  }
}
export default List;
