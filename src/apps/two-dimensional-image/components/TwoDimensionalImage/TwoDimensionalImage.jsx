import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { normalize, denormalize, schema } from 'normalizr';
import {
	Button,
	ButtonGroup,
} from 'reactstrap';
import TwoDimensionalImageContext from './twoDimensionalImageContext';
import AnnotationList from '../AnnotationList/AnnotationList.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './twoDimensionalImage.scss';
import '../Tmp/styles/ImageTool.css';
import { MdAdd, MdUndo, MdRedo } from 'react-icons/md';
import { FaCommentAlt } from 'react-icons/fa';
import { ImageAnnotation } from 'models/2DImage.js';
import { UndoRedo } from 'models/UndoRedo.js';
import MagnifierDropdown from '../MagnifierDropdown/MagnifierDropdown.jsx';
import { colors, getRandomInt } from '../Tmp/helper.js';
import i18nextInstance from './i18n';

import Canvas from '../Tmp/Canvas';
import List from '../Tmp/List';


const SHORTCUTS = {
	MAGNIFIER: {
		'1X': { key: '1', code: 49 },
		'2X': { key: '2', code: 50 },
		'3X': { key: '3', code: 51 },
		'4X': { key: '4', code: 52 },
	},
	BUTTON: {
		PREVIOUS: { key: 's', code: 83 },
		NEXT: { key: 'd', code: 68 },
		SKIP: { key: 'a', code: 65 },
	},
};

class TwoDimensionalImage extends Component {
	constructor(props) {
		super(props);
		const entities = { options: {}, annotations: {} };
		let optionRoot = '';
		let annotations = [];
		// normalize
		if (props.menu && Object.keys(props.menu).length !== 0) {
			const option = new schema.Entity('options');
			const options = new schema.Array(option);
			option.define({ options });
			const normalizedMenu = normalize(props.menu, option);
			entities.options = normalizedMenu.entities.options;
			optionRoot = normalizedMenu.result;
		} else {
			optionRoot = '0';
			entities.options['0'] = { id: '0', value: 'root', options: [] };
		}

		if (props.annotations && props.annotations.length !== 0) {
			const annotation = new schema.Entity('annotations');
			const normalizedAnn = normalize(props.annotations, [annotation]);
			entities.annotations = normalizedAnn.entities.annotations;
			annotations = normalizedAnn.result;
		}
		// console.log(annotations)
		this.state = {
			adding: false,
			focusing: '',
			magnifyingPower: 1,
			labeled: props.labeled || false,
			entities,
			inputFocused: false,
			optionRoot,
								   annotationScaleFactor: 1,
			annotationHeight: 0,
			annotationWidth: props.annotationWidth || 400,
			annotations,
								   category: props.category || '',
		};
		this.UndoRedoState = new UndoRedo();
	}

	componentDidMount = () => {
		document.addEventListener('keydown', this.handleKeydown, false);
	}

	componentWillUnmount = () => {
		document.removeEventListener('keydown', this.handleKeydown, false);
	}

	handleKeydown = (e) => {
		const { onPreviousClick, onSkipClick, onNextClick } = this.props;
		const { inputFocused } = this.state;
		if (inputFocused) return;
		switch (e.keyCode) {
		case 90:
			this.handleUndo();
			break;
		case 88:
			this.handleRedo();
			break;
		case 16:
			this.handleToggleLabel();
			break;
		case 67:
			this.handleAddClick();
			break;
		case SHORTCUTS.BUTTON.PREVIOUS.code:
			if (onPreviousClick) this.handleSubmit('Previous');
			break;
		case SHORTCUTS.BUTTON.SKIP.code:
			if (onSkipClick) this.handleSubmit('Skip');
			break;
		case SHORTCUTS.BUTTON.NEXT.code:
			if (onNextClick) this.handleSubmit('Next');
			break;
		case SHORTCUTS.MAGNIFIER['1X'].code:
			this.handleMagnifierChange(1);
			break;
		case SHORTCUTS.MAGNIFIER['2X'].code:
			this.handleMagnifierChange(2);
			break;
		case SHORTCUTS.MAGNIFIER['3X'].code:
			this.handleMagnifierChange(3);
			break;
		case SHORTCUTS.MAGNIFIER['4X'].code:
			this.handleMagnifierChange(4);
			break;
		default:
		}
	}

	handleMagnifierChange = (p) => {
		this.setState((prevState, props) => ({ magnifyingPower: p }));
	}

	handleToggleLabel = () => {
		this.setState((prevState, props) => ({ labeled: !prevState.labeled }));
	}

	handleAddClick = () => {
		this.setState((prevState, props) => ({ adding: !prevState.adding, focusing: '', category: 'Others' }));
	}

	/* ==================== chose category ==================== */
	handleCategorySelect = (category) => {
		this.setState({ category, annotations: [] });
	}

	/* ==================== undo/redo ==================== */
	handleUndo = () => {
		if (this.UndoRedoState.previous.length === 0) return;
		this.setState((prevState, props) => {
			const state = this.UndoRedoState.undo(prevState);
			return { ...state };
		});
	}

	handleRedo = () => {
		if (this.UndoRedoState.next.length === 0) return;
		this.setState((prevState, props) => {
			const state = this.UndoRedoState.redo(prevState);
			return { ...state };
		});
	}

	/* ==================== canvas ==================== */
	handleCanvasImgLoad = (e) => {
		const { annotationWidth } = this.state;
		const { target } = e;
		this.setState({ annotationScaleFactor: annotationWidth / target.naturalWidth, annotationHeight: target.height });
	}

	handleCanvasStageMouseDown = (e) => {
		const stage = e.target.getStage();
		const timeNow = new Date().getTime().toString(36);
		const color = colors[getRandomInt(colors.length)];
		let { x, y } = stage.getPointerPosition();
		let vertices;
		this.setState((prevState, props) => {
			const {
				adding, focusing, annotations, entities, annotationWidth, annotationHeight,
			} = prevState;
			if (!adding) return;
			// prevent x, y exceeding boundary
			x = x < 0 ? 0 : x; x = x > annotationWidth ? annotationWidth : x;
			y = y < 0 ? 0 : y; y = y > annotationHeight ? annotationHeight : y;
			this.UndoRedoState.save(prevState);
			// first add
			if (!focusing) {
				vertices = [];
				vertices.push({
					id: `${timeNow}`, name: `${timeNow}`, x, y,
				});
				entities.annotations[`${timeNow}`] = new ImageAnnotation({
					id: `${timeNow}`, name: `${timeNow}`, color, vertices,
				});
				return {
					category: 'Others',
								 focusing: `${timeNow}`,
								 annotations: [...annotations, `${timeNow}`],
								 entities: { ...entities, annotations: entities.annotations },
				};
			}
			// continue add vertex
			entities.annotations[focusing].vertices.push({
				id: `${timeNow}`, name: `${timeNow}`, x, y,
			});
			return { entities: { ...entities, annotations: entities.annotations } };
		});
	}

	handleCanvasVertexMouseDown = (e) => {
		const activeVertex = e.target;
		const group = activeVertex.getParent();
		this.setState((prevState, props) => {
			const { adding, focusing, entities } = prevState;
			if (adding) {
				const { annotations } = entities;
				if (group.name() === focusing && annotations[focusing].vertices[0].name === activeVertex.name()) {
					annotations[focusing].closed = true;
					return { adding: false, entities: { ...entities, annotations } };
				}
				return;
			}
			return { focusing: group.name() };
		});
	}

	handleCanvasVertexMouseMove = (e) => {}

	handleCanvasVertexDragEnd = (e) => {
		const activeVertex = e.target;
		const group = activeVertex.getParent();
		this.setState((prevState, props) => {
			const {
				adding, entities, annotationWidth, annotationHeight,
			} = prevState;
			if (adding) return;
			const { annotations } = entities;
			const vertices = annotations[group.name()].vertices.map((v) => {
				if (v.name !== activeVertex.name()) return v;
				// prevent x, y exceeding boundary
				let x = activeVertex.x(); let y = activeVertex.y();
				x = x < 0 ? 0 : x; x = x > annotationWidth ? annotationWidth : x;
				y = y < 0 ? 0 : y; y = y > annotationHeight ? annotationHeight : y;
				return { ...v, x, y };
			});
			annotations[group.name()].vertices = vertices;
			return { entities: { ...entities, annotations } };
		});
	}

	handleCanvasFocusing = (e) => {
		const activeShape = e.target;
		this.setState((prevState) => {
			if (prevState.adding) return;
			return { focusing: activeShape.name() };
		});
	}

	/* ==================== list ==================== */
	handleListItemClick = (name) => {
		this.setState({ focusing: name });
	}

	handleListItemDelete = (name) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			const { annotations } = entities;
			delete annotations[name];
			const i = prevState.annotations.indexOf(name);
			prevState.annotations.splice(i, 1);
			return { annotations: prevState.annotations, entities: { ...entities, annotations } };
		});
	}

	/* ==================== options ==================== */
	handleOptionsInputFocus = (e) => {
		this.setState({ inputFocused: true });
	}

	handleOptionsInputBlur = (e) => {
		this.setState({ inputFocused: false });
	}

	// new option
	handleOptionsAddOption = (e, parentId, value) => {
		e.preventDefault();
		this.setState((prevState) => {
			const { entities } = prevState;
			const { options } = entities;
			const id = new Date().getTime().toString(36);
			options[id] = { id, value, options: [] };
			options[parentId].options.push(id);
			return { entities: { ...entities, options } };
		});
	}

	// select item
	handleOptionsSelectOption = (name, selectedIds) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			let selected = selectedIds.map(id => entities.options[id]);
			selected = selected.map(s => ({ id: s.id, value: s.value }));
			const updatedAnn = { ...entities.annotations[name], selected };
			return { entities: { ...entities, annotations: { ...entities.annotations, [name]: updatedAnn } } };
		});
	}

	// delete item
	handleOptionsDeleteOption = (deleteIds) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			const { options } = entities;
			delete options[deleteIds[deleteIds.length - 1]];
			const i = options[deleteIds[deleteIds.length - 2]].options.indexOf(deleteIds[deleteIds.length - 1]);
			options[deleteIds[deleteIds.length - 2]].options.splice(i, 1);
			return { entities: { ...entities, options } };
		});
	}


	/* ==================== submit ==================== */

	handleSubmit = (type) => {
		const {
			annotationScaleFactor, annotationWidth, annotationHeight, annotations, category, entities, optionRoot,
		} = this.state;
		const { url } = this.props;
		const annotation = new schema.Entity('annotations');
		const denormalizedAnnotations = denormalize({ annotations }, { annotations: [annotation] }, entities).annotations;
		const option = new schema.Entity('options');
		const options = new schema.Array(option);
		option.define({ options });
		const denormalizedMenu = denormalize({ menu: optionRoot }, { menu: option }, entities).menu;
		switch (type) {
		case 'Skip':
			this.props.onSkipClick({
				url, category, annotationScaleFactor, annotationWidth, annotationHeight, annotations: denormalizedAnnotations, menu: denormalizedMenu,
			});
			break;
		case 'Previous':
			this.props.onPreviousClick({
				url, category, annotationScaleFactor, annotationWidth, annotationHeight, annotations: denormalizedAnnotations, menu: denormalizedMenu,
			});
			break;
		case 'Next':
			this.props.onNextClick({
				url, category, annotationScaleFactor, annotationWidth, annotationHeight, annotations: denormalizedAnnotations, menu: denormalizedMenu,
			});
			break;
		default:
			break;
		}
	}


	render() {
		const {
			adding, focusing, magnifyingPower, labeled, annotationWidth, annotationHeight, annotations, category, entities, optionRoot,
		} = this.state;
		const {
			url,
			emptyAnnotationReminderText,
			isDynamicOptionsEnable,
			disabledOptionLevels,

		 dynamicOptions, categoryOptions = [], viewOnly, hasPreviousButton, hasNextButton, hasSkipButton,
		} = this.props;


		const twoDimensionalImageContext = {
			entities,
			annotations,
			height: annotationHeight,
			focusing,
			emptyAnnotationReminderText,
			onAnnotationClick: this.handleListItemClick,
			onAnnotationDeleteClick: this.handleListItemDelete,
			isDynamicOptionsEnable,
			disabledOptionLevels,
			onOptionSelect: this.handleOptionsSelectOption,
			onOptionDeleteClick: this.handleOptionsDeleteOption,

			onOptionCustomizedInputFocus: this.handleOptionsInputFocus,
			onOptionCustomizedInputBlur: this.handleOptionsInputBlur,
			onOptionCustomizedFormSubmit: this.handleOptionsAddOption,

			dynamicOptions,
			optionRoot,
		};


		document.body.style.cursor = adding ? 'crosshair' : 'default';



		const toggleLabelButtonUI = (
			<Button color='link' onClick={ this.handleToggleLabel } className='label-button d-flex align-items-center'>
				<FaCommentAlt className='pr-1' />
				{labeled ? 'On' : 'Off'}
				<small className='pl-1'>(shift)</small>
			</Button>
		);
		const previousButtonUI = hasPreviousButton ? (
			<Button color='secondary' onClick={ () => this.handleSubmit('Previous') }>
				Previous
				<small>{`(${SHORTCUTS.BUTTON.PREVIOUS.key})`}</small>
			</Button>
		) : '';
		const nextButtonUI = hasNextButton ? (
			<Button color='secondary' onClick={ () => this.handleSubmit('Next') }>
				Next
				<small>{`(${SHORTCUTS.BUTTON.NEXT.key})`}</small>
			</Button>
		) : '';
		const skipButtonUI = hasSkipButton ? (
			<Button color='secondary' onClick={ () => this.handleSubmit('Skip') }>
				Skip
				<small>{`(${SHORTCUTS.BUTTON.SKIP.key})`}</small>
			</Button>
		) : '';

		return (
			<I18nextProvider i18n={ i18nextInstance }>
				<TwoDimensionalImageContext.Provider value={ twoDimensionalImageContext }>

				<div>
					{ !viewOnly && (
						<div className='d-flex justify-content-center pb-3'>
							<ButtonGroup>
								{ previousButtonUI }
								{ nextButtonUI }
							</ButtonGroup>
						</div>
					)}
					<div className='d-flex flex-wrap justify-content-around py-3' style={ { background: 'rgb(246, 246, 246)' } }>
						<div className='mb-3'>
							{ !viewOnly
								&& (
								<div className='mb-3 d-flex'>
									<div className='d-flex mr-auto'>
										{toggleLabelButtonUI}
										<MagnifierDropdown handleChange={ this.handleMagnifierChange } power={ magnifyingPower } shortcuts={ SHORTCUTS.MAGNIFIER } />
									</div>
									<ButtonGroup className=''>
										<Button disabled={ this.UndoRedoState.previous.length == 0 } outline onClick={ this.handleUndo }>
											<MdUndo />
											{' '}
											<small>(z)</small>
										</Button>
										<Button disabled={ this.UndoRedoState.next.length == 0 } outline onClick={ this.handleRedo }>
											<MdRedo />
											{' '}
											<small>(x)</small>
										</Button>
									</ButtonGroup>
								</div>
						) }
						<div style={ { position: 'relative' } }>
							<Canvas
								url={ url }
								width={ annotationWidth }
								height={ annotationHeight }
								adding={ adding }
								annotations={ annotations }
								entities={ entities }
								focusing={ focusing }
								power={ magnifyingPower }
								labeled={ labeled }
								onImgLoad={ this.handleCanvasImgLoad }
								onStageMouseDown={ this.handleCanvasStageMouseDown }
								onVertexMouseDown={ this.handleCanvasVertexMouseDown }
								onVertexDragEnd={ this.handleCanvasVertexDragEnd }
								onLabelMouseDown={ this.handleCanvasFocusing }
								onLineMouseDown={ this.handleCanvasFocusing }
							/>
						</div>
					</div>
					{ !viewOnly
					&& (
						<div className='mb-3'>
							<div className='d-flex justify-content-between mb-3'>
								<Button outline color='primary' onClick={ () => this.handleAddClick() } className='d-flex align-items-center mr-2'>
									<MdAdd />
									{' '}
									{adding ? 'Adding Annotation' : 'Add Annotation'}
									<small style={ { paddingLeft: 5 } }>(c)</small>
								</Button>
								<ButtonGroup>
									{ categoryOptions.map(c => <Button outline active={ category == c } color='info' key={ c } onClick={ () => this.handleCategorySelect(c) }>{c}</Button>) }
								</ButtonGroup>
							</div>
							<AnnotationList />
						</div>
					)
					}
				</div>
					{ !viewOnly && (
						<div className='d-flex justify-content-center pt-3'>
							{ skipButtonUI }
						</div>
					)}
			</div>
				</TwoDimensionalImageContext.Provider>
			</I18nextProvider>
		);
	}
}



TwoDimensionalImage.propTypes = {
	className: PropTypes.string,
	url: PropTypes.string,
	isDynamicOptionsEnable: PropTypes.bool,
	disabledOptionLevels: PropTypes.arrayOf(PropTypes.string),
	emptyAnnotationReminderText: PropTypes.string,
};
TwoDimensionalImage.defaultProps = {
	className: '',
	url: '',
	isDynamicOptionsEnable: false,
	disabledOptionLevels: [],
	emptyAnnotationReminderText: '',
};


export default TwoDimensionalImage;
