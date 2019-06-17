import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { normalize, denormalize, schema } from 'normalizr';
import { Button, ButtonGroup } from 'reactstrap';
import { MdRedo, MdUndo, MdAdd } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.css';
import './i18n';
import PopupDialog from 'shared/components/PopupDialog/PopupDialog.jsx';
import { highContrastingColors as colors } from 'shared/utils/colorUtils';
import { getRandomInt, getFixedNumber } from 'shared/utils/mathUtils';
import { Rectangle } from '../../models/rectangle';
import { Incident, SPLIT, HIDE, SHOW } from '../../models/incident';
import { UndoRedo } from 'models/UndoRedo.js';
import TwoDimensionalVideoContext from './twoDimensionalVideoContext';
import { getInterpolatedData, INTERPOLATION_TYPE } from '../../utils/interpolationUtils';
import Preview from '../Preview/Preview.jsx';
import Review from '../Review/Review.jsx';
import AnnotationList from '../AnnotationList/AnnotationList.jsx';
import DrawableVideoPlayer from '../DrawableVideoPlayer/DrawableVideoPlayer.jsx';
import { getLastAnnotationLabel, getUniqueKey } from '../../utils/utils';
import './twoDimensionalVideo.scss';

class TwoDimensionalVideo extends Component {
	constructor(props) {
		super(props);
		const {
			defaultAnnotations,
			videoWidth,
			previewHeader,
			previewNoticeList,
		} = props;
		/* ===  normalize annotation props === */
		const entities = { annotations: {} };
		let annotations = [];
		if (defaultAnnotations && defaultAnnotations.length !== 0) {
			const annotation = new schema.Entity('annotations');
			const normalizedAnn = normalize(defaultAnnotations, [annotation]);
			entities.annotations = normalizedAnn.entities.annotations;
			annotations = normalizedAnn.result;
			annotations.forEach((id) => {
				entities.annotations[id].isManipulatable = props.isDefaultAnnotationsManipulatable;
			});
		}
		this.state = {
			isPreviewed: previewNoticeList && previewNoticeList.length === 0 && !previewHeader,
			isSubmitted: false,
			videoWidth,
			annotationHeight: 200,
			entities,
			annotations,
			played: 0,
			isPlaying: false,
			playbackRate: 1,
			duration: 0,
			isLoop: false,
			isSeeking: false,
			isAdding: false,
			focusing: '',
			isDialogOpen: false,
			dialogTitle: '',
			dialogMessage: '',
			defaultNumAnnotations: annotations.length,
			defaultNumRootAnnotations: getLastAnnotationLabel(annotations, entities),
		};
		this.UndoRedoState = new UndoRedo();
	}

	/* ==================== video player ==================== */
	handlePlayerRef = (player) => {
		this.player = player;
	}

	handleVideoReady = () => {
		this.setState({ annotationHeight: document.getElementById('react-player').children[0].clientHeight });
	}

	handleVideoProgress = (state) => {
		const { played } = state;
		this.setState((prevState) => {
			if (prevState.isSeeking) return null;
			return { played: getFixedNumber(played, 5) };
		});
	}

	handleVideoDuration = (duration) => {
		this.setState({ duration });
	}

	handleVideoEnded = () => {
		this.setState(prevState => ({ isPlaying: prevState.isLoop }));
	}

	handleVideoRewind = () => {
		this.setState({ isPlaying: false, played: 0 });
		this.player.seekTo(0);
	}

	handleVideoPlayPause = () => {
		this.setState(prevState => ({ isPlaying: !prevState.isPlaying }));
	}

	handleVideoSpeedChange = (s) => {
		this.setState({ playbackRate: s });
	}

	handleVideoSliderMouseUp = () => {
		this.setState({ isSeeking: false });
	}

	handleVideoSliderMouseDown = () => {
		this.setState({ isPlaying: false, isSeeking: true });
	}

	handleVideoSliderChange = (e) => {
		const played = getFixedNumber(e.target.value, 5);
		this.setState((prevState) => {
			const { entities } = prevState;
			let { focusing } = prevState;
			if (focusing) {
				const { incidents } = entities.annotations[focusing];
				for (let i = 0; i < incidents.length; i += 1) {
					if (played >= incidents[i].time) {
						if (i !== incidents.length - 1 && played >= incidents[i + 1].time) continue;
						if (incidents[i].status !== SHOW) focusing = '';
						break;
					} else if (i === incidents.length - 1) focusing = '';
				}
			}
			return { played, focusing };
		}, () => { this.player.seekTo(played); });
	}

	/* ==================== canvas ==================== */

	handleCanvasStageMouseDown = (e) => {
		const { isAdding } = this.state;
		if (!isAdding) return;
		const stage = e.target.getStage();
		const position = stage.getPointerPosition();
		const uniqueKey = getUniqueKey();
		const color = colors[getRandomInt(colors.length)];
		this.setState((prevState) => {
			this.UndoRedoState.save({ ...prevState, isAdding: false }); // Undo/Redo
			const {
				annotations, entities,
			} = prevState;
			const incidents = [];
			incidents.push(Incident({
				id: `${uniqueKey}`, name: `${uniqueKey}`, x: position.x, y: position.y, height: 1, width: 1, time: prevState.played,
			}));
			entities.annotations[`${uniqueKey}`] = Rectangle({
				id: `${uniqueKey}`, name: `${uniqueKey}`, label: `${getLastAnnotationLabel(annotations, entities) + 1}`, color, incidents,
			});
			return {
				isAdding: false,
				focusing: `${uniqueKey}`,
				annotations: [...annotations, `${uniqueKey}`],
				entities: { ...entities, annotations: entities.annotations },
			};
		}, () => {
			const group = stage.find(`.${uniqueKey}`)[0];
			const bottomRight = group.get('.bottomRight')[0];
			group.moveToTop();
			bottomRight.moveToTop();
			bottomRight.startDrag();
		});
	}

	handleCanvasGroupMouseDown = (e) => {
		const group = e.target.findAncestor('Group');
		this.setState({ isPlaying: false, focusing: group.name() });
	}

	handleCanvasGroupDragEnd = (e) => {
		if (e.target.getClassName() !== 'Group') return;
		const group = e.target;
		const rect = group.get('Rect')[0];
		const position = group.position();
		const uniqueKey = getUniqueKey();
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { entities, played } = prevState;
			const { incidents } = entities.annotations[group.name()];
			for (let i = 0; i < incidents.length; i += 1) {
				if (played >= incidents[i].time) {
					// skip elapsed incidents
					if (i !== incidents.length - 1 && played >= incidents[i + 1].time) continue;
					if (played === incidents[i].time) {
						incidents[i].x = position.x; incidents[i].y = position.y; incidents[i].width = rect.width(); incidents[i].height = rect.height();
						break;
					}
					if (i === incidents.length - 1) {
						incidents.push(Incident({
							id: `${uniqueKey}`, name: `${uniqueKey}`, x: position.x, y: position.y, width: rect.width(), height: rect.height(), time: played,
						}));
						break;
					}
					incidents.splice(i + 1, 0, Incident({
						id: `${uniqueKey}`, name: `${uniqueKey}`, x: position.x, y: position.y, height: rect.height(), width: rect.width(), time: played,
					}));
					break;
				}
			}
			return {};
		});
	}

	handleCanvasDotMouseDown = (e) => {
		const group = e.target.findAncestor('Group');
		this.setState({ focusing: group.name() });
	}

	handleCanvasDotDragEnd = (e) => {
		const activeAnchor = e.target;
		const group = activeAnchor.getParent();
		const uniqueKey = getUniqueKey();
		group.draggable(true);
		const topLeft = group.get('.topLeft')[0]; const topRight = group.get('.topRight')[0]; const bottomRight = group.get('.bottomRight')[0]; const
			bottomLeft = group.get('.bottomLeft')[0];
		const maxX = Math.max(topLeft.getAbsolutePosition().x, topRight.getAbsolutePosition().x, bottomRight.getAbsolutePosition().x, bottomLeft.getAbsolutePosition().x);
		const minX = Math.min(topLeft.getAbsolutePosition().x, topRight.getAbsolutePosition().x, bottomRight.getAbsolutePosition().x, bottomLeft.getAbsolutePosition().x);
		const maxY = Math.max(topLeft.getAbsolutePosition().y, topRight.getAbsolutePosition().y, bottomRight.getAbsolutePosition().y, bottomLeft.getAbsolutePosition().y);
		const minY = Math.min(topLeft.getAbsolutePosition().y, topRight.getAbsolutePosition().y, bottomRight.getAbsolutePosition().y, bottomLeft.getAbsolutePosition().y);
		this.setState((prevState, props) => {
			this.UndoRedoState.save(prevState);
			const { entities, played } = prevState;
			const { annotations } = entities;
			const { incidents } = entities.annotations[group.name()];
			for (let i = 0; i < incidents.length; i += 1) {
				if (played >= incidents[i].time) {
					// skip elapsed incidents
					if (i !== incidents.length - 1 && played >= incidents[i + 1].time) continue;
					if (played === incidents[i].time) {
						incidents[i].x = minX; incidents[i].y = minY; incidents[i].height = maxY - minY; incidents[i].width = maxX - minX;
						break;
					}
					incidents.splice(i + 1, 0, Incident({
						id: `${uniqueKey}`, name: `${uniqueKey}`, x: minX, y: minY, height: maxY - minY, width: maxX - minX, time: played,
					}));
					break;
				}
			}
			annotations[group.name()].incidents = incidents;
			return { entities: { ...entities, annotations } };
		});
	}

	handleAnnotationItemClick = name => this.setState({ focusing: name });

	handleIncidentItemClick = (incident) => {
		const { annotationName, time } = incident;
		this.setState({ isPlaying: false, focusing: annotationName },
			() => { this.player.seekTo(parseFloat(time)); });
	}

	handleIncidentItemDelete = (e) => {
		const { annotationName, incidentName } = e;
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { entities } = prevState;
			const { annotations } = entities;
			const incidents = entities.annotations[annotationName].incidents.filter((t) => {
				if (t.name !== incidentName) return true;
				return false;
			});
			annotations[annotationName].incidents = incidents;
			return { entities: { ...entities, annotations } };
		});
	}


	handleListAnnotationDelete = (name) => {
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { entities, annotations } = prevState;
			const entitiesAnnotations = entities.annotations;
			const { label } = entitiesAnnotations[name];
			// reorder the list
			if (!isNaN(label)) {
				const lastLabel = getLastAnnotationLabel(annotations, entities);
				if (`${lastLabel}` !== '1' && `${lastLabel}` !== label) {
					const lastName = annotations.find(a => entitiesAnnotations[a].label === `${lastLabel}`);
					this.renameLabel(annotations, entitiesAnnotations, lastName, label);
				}
			}
			// remove name from the parent's childrenNames
			if (entitiesAnnotations[name].parentName) {
				const parent = entitiesAnnotations[entitiesAnnotations[name].parentName];
				const i = parent.childrenNames.indexOf(name);
				if (i !== -1) {
					parent.childrenNames.splice(i, 1);
					if (parent.childrenNames.length == 0 && parent.incidents[parent.incidents.length - 1].status === SPLIT) parent.incidents[parent.incidents.length - 1].status = SHOW;
				}
			}
			// remove all its children and itself recusively
			this.removeAnnotation(annotations, entitiesAnnotations, name);
			return { annotations, entities: { ...entities, annotations: entitiesAnnotations }, focusing: '' };
		});
	}

	removeAnnotation = (annotations, entitiesAnnotations, name) => {
		if (entitiesAnnotations[name].childrenNames.length !== 0) {
			entitiesAnnotations[name].childrenNames.forEach((c) => {
				this.removeAnnotation(annotations, entitiesAnnotations, c);
			});
		}
		delete entitiesAnnotations.name;
		const i = annotations.indexOf(name);
		annotations.splice(i, 1);
	}

	renameLabel = (annotations, entitiesAnnotations, name, label) => {
		if (entitiesAnnotations[name].childrenNames.length !== 0) {
			entitiesAnnotations[name].childrenNames.forEach((c, index) => {
				this.renameLabel(annotations, entitiesAnnotations, c, `${label}-${index + 1}`);
			});
		}
		entitiesAnnotations[name].label = label;
	}

	handleListAnnotationShowHide = (e) => {
		const { name } = e;
		const { status } = e;
		const uniqueKey = new Date().getTime().toString(36);
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { played, entities } = prevState;
			const { incidents } = entities.annotations[name];
			for (let i = 0; i < incidents.length; i += 1) {
				if (i === 0 && played < incidents[i].time) {
					incidents.splice(0, 0, Incident({
						id: `${uniqueKey}`, name: `${uniqueKey}`, x: incidents[i].x, y: incidents[i].y, height: incidents[i].height, width: incidents[i].width, time: played, status,
					}));
					break;
				}
				if (played >= incidents[i].time) {
					// skip elapsed incidents
					if (i !== incidents.length - 1 && played >= incidents[i + 1].time) continue;
					if (played === incidents[i].time) {
						incidents.splice(i, 1, Incident({
							...incidents[i], id: `${uniqueKey}`, name: `${uniqueKey}`, status,
						}));
						break;
					}
					if (i === incidents.length - 1) {
						incidents.push(Incident({
							id: `${uniqueKey}`, name: `${uniqueKey}`, x: incidents[i].x, y: incidents[i].y, height: incidents[i].height, width: incidents[i].width, time: played, status,
						}));
						break;
					}
					const interpoArea = getInterpolatedData({
						startIncident: incidents[i],
						endIncident: incidents[i + 1],
						currentTime: played,
						type: INTERPOLATION_TYPE.LENGTH,
					});
					const interpoPos = getInterpolatedData({
						startIncident: incidents[i],
						endIncident: incidents[i + 1],
						currentTime: played,
						type: INTERPOLATION_TYPE.POSITION,
					});
					incidents.splice(i + 1, 0, Incident({
						id: `${uniqueKey}`, name: `${uniqueKey}`, x: interpoPos.x, y: interpoPos.y, height: interpoArea.height, width: interpoArea.width, time: played, status,
					}));
					break;
				}
			}
			if (status === HIDE) entities.annotations[name].clearRedundantIncidents(status);
			return { entities: { ...entities, annotations: entities.annotations } };
		});
	}


	handleListAnnotationSplit = (name) => {
		const timeNow = (new Date()).getTime().toString(36);
		const timeNowChild1 = ((new Date()).getTime() + 1).toString(36);
		const timeNowChild2 = ((new Date()).getTime() + 2).toString(36);
		const status = SPLIT;
		this.setState((prevState) => {
			this.UndoRedoState.save(prevState);
			const { played, entities, annotations } = prevState;
			const parent = entities.annotations[name];
			// remove ex-childrenNames
			if (parent.childrenNames.length !== 0) {
				for (const c of parent.childrenNames) {
					delete entities.annotations[c];
					const i = annotations.indexOf(c);
					annotations.splice(i, 1);
				}
			}
			// make sure parent's color is different from its children
			let randomColor = colors[getRandomInt(colors.length)];
			while (parent.color === randomColor) randomColor = colors[getRandomInt(colors.length)];
			const childrenColor = randomColor;

			let parentX; let parentY; let parentWidth; let
				parentHeight;
			let { incidents } = parent;
			for (let i = 0; i < incidents.length; i++) {
				if (played >= incidents[i].time) {
					if (i !== incidents.length - 1 && played >= incidents[i + 1].time) continue;
					parentX = incidents[i].x;
					parentY = incidents[i].y;
					parentWidth = incidents[i].width;
					parentHeight = incidents[i].height;
					if (played === incidents[i].time) {
						incidents.splice(i, 1, Incident({
							...incidents[i], id: `${timeNow}`, name: `${timeNow}`, status,
						}));
						incidents = incidents.slice(0, i + 1);
						break;
					}
					if (i === incidents.length - 1) {
						incidents.push(Incident({
							id: `${timeNow}`, name: `${timeNow}`, x: incidents[i].x, y: incidents[i].y, height: incidents[i].height, width: incidents[i].width, time: played, status,
						}));
						break;
					}
					const interpoArea = getInterpolatedData({
						startIncident: incidents[i],
						endIncident: incidents[i + 1],
						currentTime: played,
						type: INTERPOLATION_TYPE.LENGTH,
					});
					const interpoPos = getInterpolatedData({
						startIncident: incidents[i],
						endIncident: incidents[i + 1],
						currentTime: played,
						type: INTERPOLATION_TYPE.POSITION,
					});
					parentX = interpoPos.x;
					parentY = interpoPos.y;
					parentWidth = interpoArea.width;
					parentHeight = interpoArea.height;
					incidents.splice(i + 1, 0, Incident({
						id: `${timeNow}`, name: `${timeNow}`, x: interpoPos.x, y: interpoPos.y, height: interpoArea.height, width: interpoArea.width, time: played, status,
					}));
					incidents = incidents.slice(0, i + 2);
					break;
				}
			}
			parent.childrenNames = [`${timeNowChild1}`, `${timeNowChild2}`];
			parent.incidents = incidents;
			const childIncidents1 = [Incident({
				id: `${timeNow}`, name: `${timeNow}`, x: parentX, y: parentY, height: parentHeight / 2, width: parentWidth / 2, time: played,
			})];
			const childIncidents2 = [Incident({
				id: `${timeNow}`, name: `${timeNow}`, x: parentX + parentWidth / 2 - 20, y: parentY + parentHeight / 2 - 20, height: parentHeight / 2, width: parentWidth / 2, time: played,
			})];
			entities.annotations[`${timeNowChild1}`] = Rectangle({
				id: `${timeNowChild1}`, name: `${timeNowChild1}`, label: `${parent.label}-1`, color: childrenColor, incidents: childIncidents1, parentName: parent.name,
			});
			entities.annotations[`${timeNowChild2}`] = Rectangle({
				id: `${timeNowChild2}`, name: `${timeNowChild2}`, label: `${parent.label}-2`, color: childrenColor, incidents: childIncidents2, parentName: parent.name,
			});
			const parentIndex = annotations.find(a => a === parent.name);
			annotations.splice(parentIndex, 0, `${timeNowChild1}`);
			annotations.splice(parentIndex, 0, `${timeNowChild2}`);
			return { annotations, entities, focusing: `${timeNowChild2}` };
		});
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

	/* ==================== preview ================ */
	handlePreviewClick = () => this.setState({ isPreviewed: true });

	/* ==================== review ==================== */
	handleReviewCancelSubmission = () => this.setState({ isLoop: false, isSubmitted: false, isPlaying: false });

	/* ==================== others ==================== */
	isEmptyAnnotationOrIncident = () => {
		const { annotations, defaultNumAnnotations, entities } = this.state;
		const { isEmptyCheckEnable } = this.props;
		if (!isEmptyCheckEnable) return false;
		if (annotations.length !== 0 && defaultNumAnnotations < annotations.length) {
			for (const ann of annotations) {
				if (entities.annotations[ann].incidents.length < 2) return true;
			}
			return false;
		}
		return true;
	}

	handleSubmit = () => {
		const { annotations, isSubmitted } = this.state;
		const { onSubmit, hasReview, emptyCheckSubmissionWarningText } = this.props;

		if (this.isEmptyAnnotationOrIncident()) {
			this.setState({ isDialogOpen: true, dialogTitle: 'Submission warning', dialogMessage: emptyCheckSubmissionWarningText });
			return;
		}
		if (!isSubmitted && hasReview) {
			this.setState({
				isLoop: true, isSubmitted: true, played: 0, isPlaying: true, focusing: '',
			});
			return;
		}
		const { videoWidth, annotationHeight, entities } = this.state;
		const { url } = this.props;
		const annotation = new schema.Entity('annotations');
		const denormalizedAnnotations = denormalize({ annotations }, { annotations: [annotation] }, entities).annotations;
		denormalizedAnnotations.forEach((ann) => {
			delete ann.isManipulatable;
		});
		const data = {
			url, videoWidth, annotationHeight, annotations: denormalizedAnnotations,
		};
		onSubmit(data);
	}

    handleDialogToggle = () => this.setState(prevState => ({ isDialogOpen: !prevState.isDialogOpen }));

	handleAddClick = () => this.setState(prevState => ({ isAdding: !prevState.isAdding, isPlaying: false }));

	renderAddButtonUI = () => {
		const {
			isAdding,
			defaultNumRootAnnotations,
			annotations,
			entities,
		} = this.state;
		const { numAnnotationsCanBeAdded, t } = this.props;
		const isAddButtonAvailable = (defaultNumRootAnnotations + numAnnotationsCanBeAdded) > getLastAnnotationLabel(annotations, entities);
		if (isAdding || (!isAdding && isAddButtonAvailable)) {
			return (
				<Button
					disabled={ isAdding }
					color='primary'
					onClick={ this.handleAddClick }
					className='d-flex align-items-center float-left'
				>
					<MdAdd />
					{isAdding ? t('addingBox') : t('addBox')}
				</Button>
			);
		}
		return null;
	}

	render() {
		const {
			isPreviewed,
			isSubmitted,
			videoWidth,
			annotationHeight,
			isPlaying,
			played,
			playbackRate,
			duration,
			isLoop,
			isAdding,
			focusing,
			entities,
			annotations,
			isDialogOpen,
			dialogTitle,
			dialogMessage,
		} = this.state;
		const {
			className,
			url,
			previewHeader,
			previewNoticeList,
			isEmptyCheckEnable,
			emptyCheckAnnotationItemWarningText,
			emptyAnnotationReminderText,
		} = this.props;
		const twoDimensionalVideoContext = {
			playerRef: this.handlePlayerRef,
			entities,
			annotations,
			duration,
			played,
			focusing,
			width: videoWidth,
			height: annotationHeight,
			isEmptyCheckEnable,
			url,
			isPlaying,
			isLoop,
			playbackRate,
			isAdding,
			emptyCheckAnnotationItemWarningText,
			emptyAnnotationReminderText,
			onVideoReady: this.handleVideoReady,
			onVideoProgress: this.handleVideoProgress,
			onVideoDuration: this.handleVideoDuration,
			onVideoEnded: this.handleVideoEnded,
			onVideoSliderMouseUp: this.handleVideoSliderMouseUp,
			onVideoSliderMouseDown: this.handleVideoSliderMouseDown,
			onVideoSliderChange: this.handleVideoSliderChange,
			onVideoRewind: this.handleVideoRewind,
			onVideoPlayPause: this.handleVideoPlayPause,
			onVideoSpeedChange: this.handleVideoSpeedChange,
			onCanvasStageMouseDown: this.handleCanvasStageMouseDown,
			onCanvasGroupMouseDown: this.handleCanvasGroupMouseDown,
			onCanvasGroupDragEnd: this.handleCanvasGroupDragEnd,
			onCanvasDotMouseDown: this.handleCanvasDotMouseDown,
			onCanvasDotDragEnd: this.handleCanvasDotDragEnd,
			onAnnotationItemClick: this.handleAnnotationItemClick,
			onAnnotationDeleteClick: this.handleListAnnotationDelete,
			onAnnotationShowHideClick: this.handleListAnnotationShowHide,
			onAnnotationSplitClick: this.handleListAnnotationSplit,
			onIncidentItemClick: this.handleIncidentItemClick,
			onIncidentItemDeleteClick: this.handleIncidentItemDelete,
		};

		let controlPanelUI = null;
		if (isSubmitted) {
			controlPanelUI = (
				<Review
					height={ annotationHeight }
					onConfirmSubmit={ this.handleSubmit }
					onCancelSubmit={ this.handleReviewCancelSubmission }
				/>
			);
		} else if (isPreviewed) {
			controlPanelUI = (
				<div>
					<div className='pb-3 clearfix'>
						{this.renderAddButtonUI()}
						<ButtonGroup className='float-right'>
							<Button disabled={ this.UndoRedoState.previous.length === 0 } outline onClick={ this.handleUndo }><MdUndo /></Button>
							<Button disabled={ this.UndoRedoState.next.length === 0 } outline onClick={ this.handleRedo }><MdRedo /></Button>
						</ButtonGroup>
					</div>
					<AnnotationList />
				</div>
			);
		} else {
			controlPanelUI = (
				<Preview
					height={ annotationHeight }
					notices={ previewNoticeList }
					header={ previewHeader }
					onPreviewClick={ this.handlePreviewClick }
				/>
			);
		}

		const rootClassName = `two-dimensional-video${className ? ` ${className}` : ''}`;
		return (
			<TwoDimensionalVideoContext.Provider value={ twoDimensionalVideoContext }>
				<div className={ rootClassName }>
					<div className='d-flex flex-wrap justify-content-around py-3 two-dimensional-video__main'>
						<div className='mb-3' style={ { width: videoWidth } }>
							<DrawableVideoPlayer />
						</div>
						<div className='mb-3 two-dimensional-video__control-panel'>
							{ controlPanelUI }
						</div>
					</div>
					<div className='d-flex justify-content-center pt-3'>
						{isSubmitted || !isPreviewed ? '' : (<div><Button onClick={ this.handleSubmit }>Submit</Button></div>)}
					</div>
					<PopupDialog isOpen={ isDialogOpen } title={ dialogTitle } message={ dialogMessage } onToggle={ this.handleDialogToggle } hasCloseButton />
				</div>
			</TwoDimensionalVideoContext.Provider>
		);
	}
}

TwoDimensionalVideo.propTypes = {
	className: PropTypes.string,
	defaultAnnotations: PropTypes.arrayOf(PropTypes.object),
	videoWidth: PropTypes.number,
	isDefaultAnnotationsManipulatable: PropTypes.bool,
	previewHeader: PropTypes.string,
	previewNoticeList: PropTypes.arrayOf(PropTypes.string),
	isEmptyCheckEnable: PropTypes.bool,
	hasReview: PropTypes.bool,
	url: PropTypes.string,
	numAnnotationsCanBeAdded: PropTypes.number,
	onSubmit: PropTypes.func,
	emptyCheckSubmissionWarningText: PropTypes.string,
	emptyCheckAnnotationItemWarningText: PropTypes.string,
	emptyAnnotationReminderText: PropTypes.string,
};
TwoDimensionalVideo.defaultProps = {
	className: '',
	defaultAnnotations: [],
	videoWidth: 400,
	isDefaultAnnotationsManipulatable: false,
	previewHeader: '',
	previewNoticeList: [],
	isEmptyCheckEnable: false,
	hasReview: false,
	url: '',
	numAnnotationsCanBeAdded: 1000,
	onSubmit: () => {},
	emptyCheckSubmissionWarningText: '',
	emptyCheckAnnotationItemWarningText: '',
	emptyAnnotationReminderText: '',
};
export default withTranslation()(TwoDimensionalVideo);
