import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MdPlayArrow, MdPause, MdReplay } from 'react-icons/md';
import {
	Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonGroup,
} from 'reactstrap';
import Slider from '../Slider/Slider.jsx';
import FormattedTime from '../FormattedTime/FormattedTime.jsx';
import './control.scss';

const Control = ({
	className,
	isPlaying,
	played,
	playbackRate,
	duration,
	onSliderMouseUp,
	onSliderMouseDown,
	onSliderChange,
	onRewind,
	onPlayPause,
	onSpeedChange,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { t } = useTranslation('twoDimensionalVideo');
	return (
		<div className={ `player-control${className ? ` ${className}` : ''}` }>
			<Slider
				played={ played }
				onMouseUp={ onSliderMouseUp }
				onMouseDown={ onSliderMouseDown }
				onChange={ onSliderChange }
			/>
			<div className='d-flex mt-2'>
				<div className='mr-auto d-flex align-items-center'>
					<ButtonGroup>
						<Button className='player-control__button d-flex align-items-center' color='link' onClick={ onRewind }>
							<MdReplay className='player-control__icon' />
						</Button>
						<Button className='player-control__button d-flex align-items-center' color='link' onClick={ onPlayPause }>
							{isPlaying ? <MdPause className='player-control__icon' /> : <MdPlayArrow className='player-control__icon' />}
						</Button>
					</ButtonGroup>
					<Dropdown isOpen={ isDropdownOpen } toggle={ () => setIsDropdownOpen(!isDropdownOpen) } size='sm'>
						<DropdownToggle className='player-control__speed-toggle d-flex align-items-center' color='link' caret>
							{ 'x' }
							{ playbackRate }
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem header>{t('playerControlSpeed')}</DropdownItem>
							<DropdownItem className='player-control__speed-item' onClick={ () => onSpeedChange(0.25) }>0.25</DropdownItem>
							<DropdownItem className='player-control__speed-item' onClick={ () => onSpeedChange(0.5) }>0.5</DropdownItem>
							<DropdownItem className='player-control__speed-item' onClick={ () => onSpeedChange(1) }>1</DropdownItem>
							<DropdownItem className='player-control__speed-item' onClick={ () => onSpeedChange(1.5) }>1.5</DropdownItem>
							<DropdownItem className='player-control__speed-item' onClick={ () => onSpeedChange(2) }>2</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div className='d-flex align-items-center'>
					<div className='player-control__time'>
						<FormattedTime seconds={ played * duration } />
						{' / ' }
						<FormattedTime seconds={ duration } />
					</div>
				</div>
			</div>
		</div>
	);
};

Control.propTypes = {
	className: PropTypes.string,
	isPlaying: PropTypes.bool,
	played: PropTypes.number,
	playbackRate: PropTypes.number,
	duration: PropTypes.number,
	onSliderMouseUp: PropTypes.func,
	onSliderMouseDown: PropTypes.func,
	onSliderChange: PropTypes.func,
	onRewind: PropTypes.func,
	onPlayPause: PropTypes.func,
	onSpeedChange: PropTypes.func,
};
Control.defaultProps = {
	className: '',
	isPlaying: false,
	played: 0,
	playbackRate: 1,
	duration: 0,
	onSliderMouseUp: () => {},
	onSliderMouseDown: () => {},
	onSliderChange: () => {},
	onRewind: () => {},
	onPlayPause: () => {},
	onSpeedChange: () => {},
};

export default Control;
