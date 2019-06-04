import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
	Button, Collapse, Badge, ListGroupItem,
} from 'reactstrap';
import { MdCallSplit, MdDelete } from 'react-icons/md';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';
import { SPLIT, HIDE, SHOW } from 'models/2DVideo';
import EventList from '../../EventList/EventList.jsx';
import TwoDimensionalVideoContext from '../../TwoDimensionalVideo/twoDimensionalVideoContext';
import OpenDialogButton from '../../OpenDialogButton/OpenDialogButton.jsx';

import 'bootstrap/dist/css/bootstrap.css';
import './annotationItem.scss';

const AnnotationItem = ({
	className,
	itemData,
	isDialogDisabledConst,
	isDialogDisabled,
	dispatchIsDialogDisabled,
}) => {
	const twoDimensionalVideoContext = useContext(TwoDimensionalVideoContext);
	const {
		played,
		entities,
		focusing,
		isEmptyCheckEnable,
		onAnnotationItemClick,
		onAnnotationDeleteClick,
		onAnnotationShowHideClick,
		onAnnotationSplitClick,
	} = twoDimensionalVideoContext;
	const [isEventListOpen, setIsEventListOpen] = useState(false);
	const { t } = useTranslation();

	const {
		trajectories,
		name,
		label,
		color,
		parent,
		children,
	} = itemData;
	const parentAnnotation = entities.annotations[parent];
	const childrenUI = children.map(c => (
		<Button color='link' key={ c } onClick={ () => onAnnotationItemClick(c) } className='video-ann-relatives'>
			{`${entities.annotations[c].label} `}
		</Button>
	));
	let showButtonUI = (
		<OpenDialogButton
			className='d-flex align-items-center video-ann-button'
			outline
			title={ t('dialogTitleShow') }
			message={ t('dialogMessageShow') }
			isDialogDisabled={ isDialogDisabled.show }
			onYesClick={ () => onAnnotationShowHideClick({ name, status: SHOW }) }
			onDontShowAgainChange={ e => dispatchIsDialogDisabled({ type: isDialogDisabledConst.SHOW, value: e.target.checked }) }
		>
			<IoMdEye />
			{SHOW}
		</OpenDialogButton>
	);
	let hideButtonUI = (
		<OpenDialogButton
			className='d-flex align-items-center video-ann-button'
			outline
			title={ t('dialogTitleHide') }
			message={ t('dialogMessageHide') }
			isDialogDisabled={ isDialogDisabled.hide }
			onYesClick={ () => onAnnotationShowHideClick({ name, status: HIDE }) }
			onDontShowAgainChange={ e => dispatchIsDialogDisabled({ type: isDialogDisabledConst.HIDE, value: e.target.checked }) }
		>
			<IoMdEyeOff />
			{HIDE}
		</OpenDialogButton>
	);
	let splitButtonUI = (
		<OpenDialogButton
			className='d-flex align-items-center video-ann-button'
			outline
			title={ t('dialogTitleSplit') }
			message={ t('dialogMessageSplit') }
			isDialogDisabled={ isDialogDisabled.split }
			onYesClick={ () => onAnnotationSplitClick(name) }
			onDontShowAgainChange={ e => dispatchIsDialogDisabled({ type: isDialogDisabledConst.HIDE, value: e.target.checked }) }
		>
			<MdCallSplit />
			{SPLIT}
		</OpenDialogButton>
	);
	const currentEvent = [...trajectories].reverse().find(event => played >= event.time) || {};

	switch (currentEvent.status) {
	case SHOW:
		showButtonUI = null;
		break;
	case HIDE:
		hideButtonUI = null;
		splitButtonUI = null;
		break;
	case SPLIT:
		showButtonUI = null;
		hideButtonUI = null;
		break;
	default:
		showButtonUI = null;
		hideButtonUI = null;
		splitButtonUI = null;
		break;
	}

	const warningText = isEmptyCheckEnable && trajectories.length < 2 && <span className='text-danger'>You should track the cell bound by this box</span>;
	let rootClassName = `video-ann${className ? ` ${className}` : ''}`;
	if (name !== focusing) {
		return (
			<ListGroupItem
				className={ rootClassName }
				name={ name }
				onClick={ () => onAnnotationItemClick(name) }
				action
			>
				<div className='d-flex w-100 justify-content-between align-items-center'>
					<div>{label}</div>
				</div>
				<div>{warningText}</div>
			</ListGroupItem>
		);
	}
	rootClassName = `${rootClassName} video-ann-highlight`;
	return (
		<ListGroupItem
			className={ rootClassName }
			name={ name }
			style={ { borderColor: color.replace(/,1\)/, ',.3)') } }
		>
			<div className='d-flex align-items-center mb-2'>
				<div className='video-ann-title mr-auto'><strong>{label}</strong></div>
				{splitButtonUI}
				{hideButtonUI}
				{showButtonUI}
				<OpenDialogButton
					className='d-flex align-items-center video-ann-delete'
					color='link'
					title={ t('dialogTitleDelete') }
					message={ t('dialogMessageDelete') }
					isDialogDisabled={ isDialogDisabled.delete }
					onYesClick={ () => onAnnotationDeleteClick(name) }
					onDontShowAgainChange={ e => dispatchIsDialogDisabled({ type: isDialogDisabledConst.DELETE, value: e.target.checked }) }
				>
					<MdDelete />
				</OpenDialogButton>
			</div>
			<div>
				{parentAnnotation && (
					<div>
						<Badge color='secondary'>{ t('AnnotationItemParent') }</Badge>
						<Button
							color='link'
							onClick={ () => onAnnotationItemClick(parentAnnotation.name) }
							className='video-ann-relatives'
						>
							{parentAnnotation.label}
						</Button>
					</div>
				)}
			</div>
			<div>
				{childrenUI.length > 0 && (
					<div>
						<Badge color='secondary'>{ t('AnnotationItemChildren') }</Badge>
						{childrenUI}
					</div>
				)}
			</div>
			<Button
				color='link'
				className='d-flex align-items-center justify-content-between event-list-toggle-button p-3 mt-2'
				onClick={ () => setIsEventListOpen(!isEventListOpen) }
				style={ { marginBottom: 0 } }
			>
				<div>{ t('AnnotationItemEventHistory') }</div>
				{isEventListOpen ? <FaChevronUp /> : <FaChevronDown />}
			</Button>
			<Collapse isOpen={ isEventListOpen }>
				<EventList events={ trajectories } annotationName={ name } />
			</Collapse>
			<div className='mt-3'>
				{warningText}
			</div>
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
