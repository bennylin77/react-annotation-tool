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
import { MdAdd } from 'react-icons/md';
import { FaCommentAlt } from 'react-icons/fa';
import { UndoRedo } from 'models/UndoRedo.js';
import { highContrastingColors as colors } from 'shared/utils/colorUtils';
import { getRandomInt } from 'shared/utils/mathUtils';
import { Polygon } from '../../models/polygon';
import { Vertex } from '../../models/vertex';
import { getUniqueKey } from '../../utils/utils';
import MagnifierDropdown from '../MagnifierDropdown/MagnifierDropdown.jsx';
import TwoDimensionalImageContext from './twoDimensionalImageContext';
import AnnotationList from '../AnnotationList/AnnotationList.jsx';
import UndoRedoButton from '../UndoRedoButton/UndoRedoButton.jsx';
import Canvas from '../Canvas/Canvas.jsx';
import i18nextInstance from './i18n';

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
	UNDO_REDO: {
		UNDO: { key: 'z', code: 90 },
		REDO: { key: 'x', code: 88 },
	},
};
class TwoDimensionalImage extends Component {
	constructor(props) {
		super(props);
		const {
			defaultAnnotations,
			isLabelOn,
			imageWidth,
		} = props;

		const entities = { options: {}, annotations: {} };
		let rootOptionId = '';
		let annotations = [];
		// normalize
		if (props.options && Object.keys(props.options).length !== 0) {
			const option = new schema.Entity('options');
			const children = new schema.Array(option);
			option.define({ children });
			const normalizedOptions = normalize(props.options, option);
			entities.options = normalizedOptions.entities.options;
			rootOptionId = normalizedOptions.result;
		} else {
			rootOptionId = '0';
			entities.options['0'] = { id: '0', value: 'root', children: [] };
		}

		if (defaultAnnotations && defaultAnnotations.length !== 0) {
			const annotation = new schema.Entity('annotations');
			const normalizedAnn = normalize(defaultAnnotations, [annotation]);
			entities.annotations = normalizedAnn.entities.annotations;
			annotations = normalizedAnn.result;
		}

		this.state = {
			isAdding: false,
			focusedName: '',
			magnifyingPower: 1,
			isLabelOn,
			entities,
			customizedOptionInputFocused: false,
			rootOptionId,
			imageScaleFactor: 1,
			imageHeight: 0,
			imageWidth,
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
		case SHORTCUTS.UNDO_REDO.UNDO.code:
			this.handleUndoClick();
			break;
		case SHORTCUTS.UNDO_REDO.REDO.code:
			this.handleRedoClick();
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
		this.setState(prevState => ({ isLabelOn: !prevState.isLabelOn }));
	}

	handleAddClick = () => {
		this.setState(prevState => ({ isAdding: !prevState.isAdding, focusedName: '' }));
	}

	/* ==================== undo/redo ==================== */
	handleUndoClick = () => {
		if (this.UndoRedoState.previous.length === 0) return;
		this.setState((prevState) => {
			const state = this.UndoRedoState.undo(prevState);
			return { ...state };
		});
	}

	handleRedoClick = () => {
		if (this.UndoRedoState.next.length === 0) return;
		this.setState((prevState) => {
			const state = this.UndoRedoState.redo(prevState);
			return { ...state };
		});
	}

	/* ==================== canvas ==================== */
	handleCanvasImgLoad = (e) => {
		const { imageWidth } = this.state;
		const { target } = e;
		this.setState({ imageScaleFactor: imageWidth / target.naturalWidth, imageHeight: target.height });
	}

	handleCanvasStageMouseDown = (e) => {
		const stage = e.target.getStage();
		const uniqueKey = getUniqueKey();
		const color = colors[getRandomInt(colors.length)];
		let { x, y } = stage.getPointerPosition();
		let vertices;
		this.setState((prevState) => {
			const {
				isAdding, focusedName, annotations, entities, imageWidth, imageHeight,
			} = prevState;
			if (!isAdding) return {};
			// prevent x, y exceeding boundary
			x = x < 0 ? 0 : x; x = x > imageWidth ? imageWidth : x;
			y = y < 0 ? 0 : y; y = y > imageHeight ? imageHeight : y;
			this.UndoRedoState.save(prevState);
			// first time adding
			if (!focusedName) {
				vertices = [];
				vertices.push(Vertex({
					id: `${uniqueKey}`, name: `${uniqueKey}`, x, y,
				}));
				entities.annotations[`${uniqueKey}`] = Polygon({
					id: `${uniqueKey}`, name: `${uniqueKey}`, color, vertices,
				});
				return {
					focusedName: `${uniqueKey}`,
					annotations: [...annotations, `${uniqueKey}`],
					entities: { ...entities, annotations: entities.annotations },
				};
			}
			// continuing adding
			entities.annotations[focusedName].vertices.push(Vertex({
				id: `${uniqueKey}`, name: `${uniqueKey}`, x, y,
			}));
			return { entities: { ...entities, annotations: entities.annotations } };
		});
	}

	handleCanvasVertexMouseDown = (e) => {
		const activeVertex = e.target;
		const group = activeVertex.getParent();
		this.setState((prevState) => {
			const { isAdding, focusedName, entities } = prevState;
			if (isAdding) {
				const { annotations } = entities;
				if (group.name() === focusedName && annotations[focusedName].vertices[0].name === activeVertex.name()) {
					annotations[focusedName].isClosed = true;
					return { isAdding: false, entities: { ...entities, annotations } };
				}
				return {};
			}
			return { focusedName: group.name() };
		});
	}

	handleCanvasVertexDragEnd = (e) => {
		const activeVertex = e.target;
		const group = activeVertex.getParent();
		this.setState((prevState) => {
			const {
				isAdding, entities, imageWidth, imageHeight,
			} = prevState;
			if (isAdding) return {};
			const { annotations } = entities;
			const vertices = annotations[group.name()].vertices.map((v) => {
				if (v.name !== activeVertex.name()) return v;
				// prevent x, y exceeding boundary
				let x = activeVertex.x(); let y = activeVertex.y();
				x = x < 0 ? 0 : x; x = x > imageWidth ? imageWidth : x;
				y = y < 0 ? 0 : y; y = y > imageHeight ? imageHeight : y;
				return { ...v, x, y };
			});
			annotations[group.name()].vertices = vertices;
			return { entities: { ...entities, annotations } };
		});
	}

	handleCanvasFocusing = (e) => {
		const activeShape = e.target;
		this.setState((prevState) => {
			if (prevState.isAdding) return {};
			return { focusedName: activeShape.name() };
		});
	}

	/* ==================== anootation list ==================== */
	handleAnnotationClick = (name) => { this.setState({ focusedName: name }); };

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
			options[uniqueKey] = { id: uniqueKey, value, children: [] };
			options[parentId].children.push(uniqueKey);
			return { entities: { ...entities, options } };
		});
	}

	handleOptionSelect = (name, selectedIds) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			const selectedOptions = selectedIds.map(id => entities.options[id]).map(s => ({ id: s.id, value: s.value }));
			const updatedAnn = { ...entities.annotations[name], selectedOptions };
			return { entities: { ...entities, annotations: { ...entities.annotations, [name]: updatedAnn } } };
		});
	}

	handleOptionDeleteClick = (deleteIds) => {
		this.setState((prevState) => {
			const { entities } = prevState;
			const { options } = entities;
			delete options[deleteIds[deleteIds.length - 1]];
			const i = options[deleteIds[deleteIds.length - 2]].children.indexOf(deleteIds[deleteIds.length - 1]);
			options[deleteIds[deleteIds.length - 2]].children.splice(i, 1);
			return { entities: { ...entities, options } };
		});
	}


	/* ==================== submit ==================== */

	handleSubmit = (type) => {
		const {
			imageScaleFactor, imageWidth, imageHeight, annotations, entities, rootOptionId,
		} = this.state;
		const { url, onSkipClick, onPreviousClick, onNextClick } = this.props;
		const annotation = new schema.Entity('annotations');
		const denormalizedAnnotations = denormalize({ annotations }, { annotations: [annotation] }, entities).annotations;
		const option = new schema.Entity('options');
		const children = new schema.Array(option);
		option.define({ children });
		const denormalizedOptions = denormalize({ options: rootOptionId }, { options: option }, entities).options;
		switch (type) {
		case 'Skip':
			onSkipClick({
				url, imageScaleFactor, imageWidth, imageHeight, annotations: denormalizedAnnotations, options: denormalizedOptions,
			});
			break;
		case 'Previous':
			onPreviousClick({
				url, imageScaleFactor, imageWidth, imageHeight, annotations: denormalizedAnnotations, options: denormalizedOptions,
			});
			break;
		case 'Next':
			onNextClick({
				url, imageScaleFactor, imageWidth, imageHeight, annotations: denormalizedAnnotations, options: denormalizedOptions,
			});
			break;
		default:
			break;
		}
	}

	render() {
		const {
			isAdding,
			focusedName,
			magnifyingPower,
			isLabelOn,
			imageWidth,
			imageHeight,
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
			url,
			isAdding,
			entities,
			annotations,
			height: imageHeight,
			width: imageWidth,
			focusedName,
			isLabelOn,
			magnifyingPower,
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
			onCanvasStageMouseDown: this.handleCanvasStageMouseDown,
			onCanvasVertexMouseDown: this.handleCanvasVertexMouseDown,
			onCanvasVertexDragEnd: this.handleCanvasVertexDragEnd,
			onCanvasLabelMouseDown: this.handleCanvasFocusing,
			onCanvasLineMouseDown: this.handleCanvasFocusing,
			onCanvasImgLoad: this.handleCanvasImgLoad,
			rootOptionId,
		};
		document.body.style.cursor = isAdding ? 'crosshair' : 'default';

		const toggleLabelButtonUI = (
			<Button color='link' onClick={ this.handleToggleLabel } className='two-dimensional-image__label-button d-flex align-items-center'>
				<FaCommentAlt className='pr-1' />
				{isLabelOn ? 'On' : 'Off'}
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
				{isAdding ? 'Adding Annotation' : 'Add Annotation'}
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
										<UndoRedoButton
											undoRedoState={ this.UndoRedoState }
											onUndoClick={ this.handleUndoClick }
											onRedoClick={ this.handleRedoClick }
											shortcuts={ SHORTCUTS.UNDO_REDO }
										/>
									</div>
								)}
								<div style={ { position: 'relative' } }>
									<Canvas
										entities={ entities }
										focusedName={ focusedName }
										power={ magnifyingPower }
										isLabelOn={ isLabelOn }
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
	imageWidth: PropTypes.number,
	defaultAnnotations: PropTypes.arrayOf(PropTypes.object),
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
	isLabelOn: PropTypes.bool,
	options: PropTypes.shape({
		id: PropTypes.string,
		value: PropTypes.string,
		children: PropTypes.array,
	}),
};
TwoDimensionalImage.defaultProps = {
	className: '',
	url: '',
	imageWidth: 400,
	defaultAnnotations: [],
	options: {},
	isDynamicOptionsEnable: false,
	disabledOptionLevels: [],
	isLabelOn: false,
	isViewOnlyMode: false,
	emptyAnnotationReminderText: '',
	hasPreviousButton: false,
	hasNextButton: false,
	hasSkipButton: false,
	onPreviousClick: () => {},
	onSkipClick: () => {},
	onNextClick: () => {},
};
export default TwoDimensionalImage;
