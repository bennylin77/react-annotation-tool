import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
	ListGroup, ListGroupItem, Button,
} from 'reactstrap';
import { MdDelete } from 'react-icons/md';
import { FaArrowDown } from 'react-icons/fa';
import RoundedNumber from 'shared/components/Math/RoundedNumber/RoundedNumber.jsx';
import TwoDimensionalVideoContext from '../TwoDimensionalVideo/twoDimensionalVideoContext';
import Duration from '../VideoPlayer/FormattedTime/FormattedTime.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './incidentList.scss';

const IncidentList = ({
	className,
	annotationName,
	incidents,
}) => {
	const { t } = useTranslation('twoDimensionalVideo');
	const twoDimensionalVideoContext = useContext(TwoDimensionalVideoContext);
	const {
		played,
		duration,
		onIncidentItemClick,
		onIncidentItemDeleteClick,
	} = twoDimensionalVideoContext;
	const incidentListUI = incidents.map((incident, index) => {
		const {
			name,
			time,
			width,
			height,
			status,
			x,
			y,
		} = incident;

		const itemButtonStyle = {};
		if (time === played) {
			itemButtonStyle.color = 'rgb(33, 37, 41)';
		}
		const isNotLastIncidentAndPlayedBetweenCurrentAndNext = (
			index !== incidents.length - 1 &&
			played > time &&
			played < incidents[index + 1].time
		);
		const isLastIncidentAndPlayedOverCurrent = (index === incidents.length - 1 && played > time);
		const arrowDown = isNotLastIncidentAndPlayedBetweenCurrentAndNext || isLastIncidentAndPlayedOverCurrent ?
			(
				<ListGroupItem key={ time + 1 } className='incident-list__item'>
					<FaArrowDown style={ { color: '', fontSize: '1em' } } />
				</ListGroupItem>
			) : null;

		return (
			<Fragment key={ time }>
				<ListGroupItem
					key={ time }
					className='incident-list__item d-flex align-items-center justify-content-between'
				>
					<Button
						color='link'
						className='incident-list__item-button d-flex justify-content-between'
						style={ itemButtonStyle }
						onClick={ () => onIncidentItemClick({ time, annotationName }) }
					>
						<div className='incident-list__item-status pr-1'>
							<b>{ status }</b>
							{' '}
							<Duration className='incident-list__item-duration' seconds={ duration * time } />
						</div>
						<div className='incident-list__item-size pr-1'>
							<b>{ t('incidentSize') }</b>
							{' '}
							<RoundedNumber number={ width } />
							{'x'}
							<RoundedNumber number={ height } />
						</div>
						<div className='incident-list__item-position'>
							<b>{ t('incidentPosition') }</b>
							{' '}
							<RoundedNumber number={ x } />
							{':'}
							<RoundedNumber number={ y } />
						</div>
					</Button>
					<Button
						className='incident-list__item-delete-button'
						color='link'
						onClick={ () => onIncidentItemDeleteClick({ annotationName, incidentName: name }) }
					>
						<MdDelete />
					</Button>
				</ListGroupItem>
				{arrowDown}
			</Fragment>
		);
	});

	const rootClassName = `incident-list px-3 py-2 text-center${className ? ` ${className}` : ''}`;
	return (
		<ListGroup className={ rootClassName }>
			{incidentListUI}
		</ListGroup>
	);
};

IncidentList.propTypes = {
	className: PropTypes.string,
	annotationName: PropTypes.string,
	incidents: PropTypes.arrayOf(PropTypes.object),
};
IncidentList.defaultProps = {
	className: '',
	annotationName: '',
	incidents: [],
};
export default IncidentList;
