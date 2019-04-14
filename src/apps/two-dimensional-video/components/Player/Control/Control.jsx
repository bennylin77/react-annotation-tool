import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdPlayArrow, MdPause, MdReplay } from 'react-icons/md';
import {
	Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonGroup,
} from 'reactstrap';
import Slider from '../Slider/Slider.jsx';
import FormattedTime from '../FormattedTime/FormattedTime.jsx';
import './Control.css';


const Control = ({
	className,
	playing,
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
	return (
		<div className={ `${className} player-control` }>
			<Slider
				played={ played }
				onMouseUp={ onSliderMouseUp }
				onMouseDown={ onSliderMouseDown }
				onChange={ onSliderChange }
			/>
			<div className='d-flex mt-2'>
				<div className='mr-auto d-flex align-items-center'>
					<ButtonGroup>
						<Button className='player-button d-flex align-items-center' color='link' onClick={ onRewind }>
							<MdReplay style={{fontSize: '30px'}}/>
						</Button>
						<Button className='player-button d-flex align-items-center' color='link' onClick={onPlayPause}>
							{playing ? <MdPause style={{fontSize: '30px'}}/> : <MdPlayArrow style={{fontSize: '30px'}}/>}
						</Button>
					</ButtonGroup>
					<Dropdown isOpen={ isDropdownOpen } toggle={ () => setIsDropdownOpen(!isDropdownOpen) } size='sm'>
						<DropdownToggle className='speed-toggle d-flex align-items-center' color='link' caret>
							{ 'x' }
							{ playbackRate }
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem header>Speed</DropdownItem>
							<DropdownItem className='speed-item' onClick={ () => onSpeedChange(0.25) }>0.25</DropdownItem>
							<DropdownItem className='speed-item' onClick={ () => onSpeedChange(0.5) }>0.5</DropdownItem>
							<DropdownItem className='speed-item' onClick={ () => onSpeedChange(1) }>1</DropdownItem>
							<DropdownItem className='speed-item' onClick={ () => onSpeedChange(1.5) }>1.5</DropdownItem>
							<DropdownItem className='speed-item' onClick={ () => onSpeedChange(2) }>2</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div className='d-flex align-items-center'>
					<div>
						<FormattedTime seconds={ played * duration } />
						{' '}
						{'/'}
						{' '}
						<FormattedTime seconds={ duration } />
					</div>
				</div>
			</div>
		</div>
	);
};

Control.propTypes = {
	className: PropTypes.string,
};
Control.defaultProps = {
	className: '',
};

export default Control;
