import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { normalize, denormalize, schema } from 'normalizr';
import {
	Button,
	ButtonGroup,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './twoDimensionalImage.scss';
import '../Tmp/styles/ImageTool.css';
import { MdAdd, MdUndo, MdRedo } from 'react-icons/md';
import { FaCommentAlt } from 'react-icons/fa';
import { ImageAnnotation } from 'models/2DImage.js';
import { UndoRedo } from 'models/UndoRedo.js';
import { highContrastingColors as colors } from 'shared/utils/colorUtils';
import { getRandomInt } from 'shared/utils/mathUtils';
import { getUniqueKey } from '../../utils/utils';
import MagnifierDropdown from '../MagnifierDropdown/MagnifierDropdown.jsx';
import TwoDimensionalImageContext from './twoDimensionalImageContext';
import AnnotationList from '../AnnotationList/AnnotationList.jsx';
import i18nextInstance from './i18n';
import Canvas from '../Tmp/Canvas';


const SHORTCUTS = {
	MAGNIFIER: {
		'1X': { key: '1', code: 49 },
		'2X': { key: '2', code: 50 },
		'3X': { key: '3', code: 51 },
		'4X': { key: '4', code: 52 },
	},
	BUTTON: {
		ADD: { key: 'c', code: 67 },
		PREVIOUS: { key: 's', code: 83 },
		NEXT: { key: 'd', code: 68 },
		SKIP: { key: 'a', code: 65 },
		TOGGLE_LABEL: { key: 'shift', code: 16 },
	},
};

class TwoDimensionalImage extends Component {
	constructor(props) {
		super(props);
		const entities = { options: {}, annotations: {} };
		let rootOptionId = '';
		let annotations = [];
		// normalize
		if (props.menu && Object.keys(props.menu).length !== 0) {
			const option = new schema.Entity('options');
			const options = new schema.Array(option);
			option.define({ options });
			const normalizedMenu = normalize(props.menu, option);
			entities.options = normalizedMenu.entities.options;
			rootOptionId = normalizedMenu.result;
		} else {
			rootOptionId = '0';
			entities.options['0'] = { id: '0', value: 'root', options: [] };
		}

		if (props.annotations && props.annotations.length !== 0) {
			const annotation = new schema.Entity('annotations');
			const normalizedAnn = normalize(props.annotations, [annotation]);
			entities.annotations = normalizedAnn.entities.annotations;
			annotations = normalizedAnn.result;
		}

		this.state = {
			adding: false,
			focusing: '',
			magnifyingPower: 1,
			labeled: props.labeled || false,
			entities,
			customizedOptionInputFocused: false,
			rootOptionId,
			annotationScaleFactor: 1,
			annotationHeight: 0,
			annotationWidth: props.annotationWidth || 400,
			annotations,
		};
		this.UndoRedoState = new UndoRedo();
	}

	componentDidMount = () => {
		document.addEventListener('keydown', this.handleKeydown, false);
	}

	componentWillUnmount = () => {
		document.removeEventListener('keydown', this.handleKeydown, false);
	}

	/* ==================== shortkey ==================== */
	handleKeydown = (e) => {
		const { onPreviousClick, onSkipClick, onNextClick } = this.props;
		const { customizedOptionInputFocused } = this.state;
		if (customizedOptionInputFocused) return;
		switch (e.keyCode) {
		case 90:
			this.handleUndo();
			break;
		case 88:
			this.handleRedo();
			break;
		case SHORTCUTS.BUTTON.TOGGLE_LABEL.code:
			this.handleToggleLabel();
			break;
		case SHORTCUTS.BUTTON.ADD.code:
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

	/* ==================== control ==================== */
	handleMagnifierChange = (power) => {
		this.setState({ magnifyingPower: power });
	}

	handleToggleLabel = () => {
		this.setState(prevState => ({ labeled: !prevState.labeled }));
	}

	handleAddClick = () => {
		this.setState(prevState => ({ adding: !prevState.adding, focusing: '' }));
	}

	/* ==================== undo/redo ==================== */
	handleUndo = () => {
		if (this.UndoRedoState.previous.length === 0) return;
		this.setState((prevState) => {
			const state = this.UndoRedoState.undo(prevState);
			return { ...state };
		});
	}

	handleRedo = () => {
		if (this.UndoRedoState.next.length === 0) return;
		this.setState((prevState) => {
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

	/* ==================== anootation list ==================== */
	handleAnnotationClick = (name) => { this.setState({ focusing: name }); };

	handleAnnotationDeleteClick = (name) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			const { annotations } = entities;
			delete annotations[name];
			const i = prevState.annotations.indexOf(name);
			prevState.annotations.splice(i, 1);
			return { annotations: prevState.annotations, entities: { ...entities, annotations } };
		});
	}

	/* ==================== option list ==================== */
	handleOptionCustomizedInputFocus = () => this.setState({ customizedOptionInputFocused: true });

	handleOptionCustomizedInputBlur = () => this.setState({ customizedOptionInputFocused: false });

	handleOptionCustomizedFormSubmit = (e, parentId, value) => {
		e.preventDefault();
		this.setState((prevState) => {
			const { entities } = prevState;
			const { options } = entities;
			const uniqueKey = getUniqueKey();
			options[uniqueKey] = { id: uniqueKey, value, options: [] };
			options[parentId].options.push(uniqueKey);
			return { entities: { ...entities, options } };
		});
	}

	handleOptionSelect = (name, selectedIds) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			let selected = selectedIds.map(id => entities.options[id]);
			selected = selected.map(s => ({ id: s.id, value: s.value }));
			const updatedAnn = { ...entities.annotations[name], selected };
			return { entities: { ...entities, annotations: { ...entities.annotations, [name]: updatedAnn } } };
		});
	}

	handleOptionDeleteClick = (deleteIds) => {
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
			annotationScaleFactor, annotationWidth, annotationHeight, annotations, entities, rootOptionId,
		} = this.state;
		const { url, onSkipClick, onPreviousClick, onNextClick } = this.props;
		const annotation = new schema.Entity('annotations');
		const denormalizedAnnotations = denormalize({ annotations }, { annotations: [annotation] }, entities).annotations;
		const option = new schema.Entity('options');
		const options = new schema.Array(option);
		option.define({ options });
		const denormalizedMenu = denormalize({ menu: rootOptionId }, { menu: option }, entities).menu;
		switch (type) {
		case 'Skip':
			onSkipClick({
				url, annotationScaleFactor, annotationWidth, annotationHeight, annotations: denormalizedAnnotations, menu: denormalizedMenu,
			});
			break;
		case 'Previous':
			onPreviousClick({
				url, annotationScaleFactor, annotationWidth, annotationHeight, annotations: denormalizedAnnotations, menu: denormalizedMenu,
			});
			break;
		case 'Next':
			onNextClick({
				url, annotationScaleFactor, annotationWidth, annotationHeight, annotations: denormalizedAnnotations, menu: denormalizedMenu,
			});
			break;
		default:
			break;
		}
	}

	render() {
		const {
			adding,
			focusing,
			magnifyingPower,
			labeled,
			annotationWidth,
			annotationHeight,
			annotations,
			entities,
			rootOptionId,
		} = this.state;
		const {
			className,
			url,
			emptyAnnotationReminderText,
			isDynamicOptionsEnable,
			disabledOptionLevels,
			isViewOnlyMode,
			hasPreviousButton,
			hasNextButton,
			hasSkipButton,
		} = this.props;
		const twoDimensionalImageContext = {
			entities,
			annotations,
			height: annotationHeight,
			focusing,
			emptyAnnotationReminderText,
			onAnnotationClick: this.handleAnnotationClick,
			onAnnotationDeleteClick: this.handleAnnotationDeleteClick,
			isDynamicOptionsEnable,
			disabledOptionLevels,
			onOptionSelect: this.handleOptionSelect,
			onOptionDeleteClick: this.handleOptionDeleteClick,
			onOptionCustomizedInputFocus: this.handleOptionCustomizedInputFocus,
			onOptionCustomizedInputBlur: this.handleOptionCustomizedInputBlur,
			onOptionCustomizedFormSubmit: this.handleOptionCustomizedFormSubmit,
			rootOptionId,
		};
		document.body.style.cursor = adding ? 'crosshair' : 'default';

		const toggleLabelButtonUI = (
			<Button color='link' onClick={ this.handleToggleLabel } className='label-button d-flex align-items-center'>
				<FaCommentAlt className='pr-1' />
				{labeled ? 'On' : 'Off'}
				<small className='pl-1'>{`(${SHORTCUTS.BUTTON.TOGGLE_LABEL.key})`}</small>
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

		const addButtonUI = (
			<Button
				outline
				className='d-flex align-items-center mb-3 two-dimensional-image__add-button'
				color='primary'
				onClick={ () => this.handleAddClick() }
			>
				<MdAdd />
				{adding ? 'Adding Annotation' : 'Add Annotation'}
				<small>{`(${SHORTCUTS.BUTTON.ADD.key})`}</small>
			</Button>
		);

		const rootClassName = `two-dimensional-image${className ? ` ${className}` : ''}`;

		return (
			<I18nextProvider i18n={ i18nextInstance }>
				<TwoDimensionalImageContext.Provider value={ twoDimensionalImageContext }>
					<div className={ rootClassName }>
						{ !isViewOnlyMode && (
							<div className='d-flex justify-content-center pb-3'>
								<ButtonGroup>
									{ previousButtonUI }
									{ nextButtonUI }
								</ButtonGroup>
							</div>
						)}
						<div className='d-flex flex-wrap justify-content-around py-3 two-dimensional-image__image-canvas-container'>
							<div className='mb-3'>
								{ !isViewOnlyMode && (
									<div className='mb-3 d-flex'>
										<div className='d-flex mr-auto'>
											{toggleLabelButtonUI}
											<MagnifierDropdown
												handleChange={ this.handleMagnifierChange }
												power={ magnifyingPower }
												shortcuts={ SHORTCUTS.MAGNIFIER }
											/>
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
							{ !isViewOnlyMode && (
								<div className='mb-3'>
									{addButtonUI}
									<AnnotationList />
								</div>
							)}
						</div>
						{ !isViewOnlyMode && (
							<div className='d-flex justify-content-center pt-3'>{ skipButtonUI }</div>
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
	isViewOnlyMode: PropTypes.bool,
	hasPreviousButton: PropTypes.bool,
	hasNextButton: PropTypes.bool,
	hasSkipButton: PropTypes.bool,
	onPreviousClick: PropTypes.func,
	onSkipClick: PropTypes.func,
	onNextClick: PropTypes.func,
};
TwoDimensionalImage.defaultProps = {
	className: '',
	url: '',
	isDynamicOptionsEnable: false,
	disabledOptionLevels: [],
	emptyAnnotationReminderText: '',
	isViewOnlyMode: false,
	hasPreviousButton: false,
	hasNextButton: false,
	hasSkipButton: false,
	onPreviousClick: () => {},
	onSkipClick: () => {},
	onNextClick: () => {},
};
export default TwoDimensionalImage;
