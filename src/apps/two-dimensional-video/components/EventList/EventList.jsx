import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import {
	ListGroup, ListGroupItem, Button,
} from 'reactstrap';
import { MdDelete } from 'react-icons/md';
import { FaArrowDown } from 'react-icons/fa';
import RoundedNumber from 'shared/components/Math/RoundedNumber/RoundedNumber.jsx';
import TwoDimensionalVideoContext from '../TwoDimensionalVideo/twoDimensionalVideoContext';
import Duration from '../VideoPlayer/FormattedTime/FormattedTime.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './eventList.scss';

const EventList = ({
	className,
	annotationName,
	events,
}) => {
	const twoDimensionalVideoContext = useContext(TwoDimensionalVideoContext);
	const {
		played,
		duration,
		onEventItemClick,
		onEventDeleteClick,
	} = twoDimensionalVideoContext;
	const eventListUI = events.map((event, index) => {
		const {
			name,
			time,
			width,
			height,
			status,
			x,
			y,
		} = event;

		const itemButtonStyle = {};
		if (time === played) {
			itemButtonStyle.color = 'rgb(33, 37, 41)';
		}
		const isNotLastEventAndPlayedBetweenCurrentAndNext = (
			index !== events.length - 1 &&
			played > time &&
			played < events[index + 1].time
		);
		const isLastEventAndPlayedOverCurrent = (index === events.length - 1 && played > time);
		const arrowDown = isNotLastEventAndPlayedBetweenCurrentAndNext || isLastEventAndPlayedOverCurrent ?
			(
				<ListGroupItem key={ time + 1 } className='event-list__item'>
					<FaArrowDown style={ { color: '', fontSize: '1em' } } />
				</ListGroupItem>
			) : null;

		return (
			<Fragment key={ time }>
				<ListGroupItem
					key={ time }
					className='event-list__item d-flex align-items-center justify-content-between'
				>
					<Button
						color='link'
						className='event-list__item-button d-flex justify-content-between'
						style={ itemButtonStyle }
						onClick={ () => onEventItemClick({ time, annotationName }) }
					>
						<div className='event-list__item-status pr-1'>
							<Trans i18nKey='eventStatus'>
								<b>{{ status }}</b>
								<Duration seconds={ duration * time } />
							</Trans>
						</div>
						<div className='event-list__item-size pr-1'>
							<Trans i18nKey='eventSize'>
								<b>Size</b>
								<RoundedNumber number={ width } />
								<RoundedNumber number={ height } />
							</Trans>
						</div>
						<div className='event-list__item-position'>
							<Trans i18nKey='eventPosition'>
								<b>Position</b>
								<RoundedNumber number={ x } />
								<RoundedNumber number={ y } />
							</Trans>
						</div>
					</Button>
					<Button
						className='event-list__item-delete-button'
						color='link'
						onClick={ () => onEventDeleteClick({ annotationName, eventName: name }) }
					>
						<MdDelete />
					</Button>
				</ListGroupItem>
				{arrowDown}
			</Fragment>
		);
	});

	const rootClassName = `event-list px-3 py-2 text-center${className ? ` ${className}` : ''}`;
	return (
		<ListGroup className={ rootClassName }>
			{eventListUI}
		</ListGroup>
	);
};

EventList.propTypes = {
	className: PropTypes.string,
	annotationName: PropTypes.string,
	events: PropTypes.arrayOf(PropTypes.object),
};
EventList.defaultProps = {
	className: '',
	annotationName: '',
	events: [],
};
export default EventList;
