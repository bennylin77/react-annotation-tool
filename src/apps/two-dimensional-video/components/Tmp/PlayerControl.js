import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import {MdPlayArrow, MdPause, MdReplay} from 'react-icons/md';
import {Button, ButtonGroup} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import './styles/PlayerControl.css';
import Slider from './Slider';
import Duration from './Duration';

class PlayerControl extends Component {
	constructor(props) {
    super(props);
    this.state = {dropdownOpen: false};
  }
	handleSpeedToggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
	handleSliderMouseUp = (e) =>{
		this.props.onPlayerControlSliderMouseUp(e)
	}
	handleSliderMouseDown = (e) =>{
		this.props.onPlayerControlSliderMouseDown(e)
	}
	handleSliderChange = (e) =>{
		this.props.onPlayerControlSliderChange(e)
	}
	handleVideoRewind = () =>{
		this.props.onPlayerControlVideoRewind()
	}
	handleVideoPlayPause = () =>{
		this.props.onPlayerControlVideoPlayPause()
	}
	handleVideoSpeed = (s) => {
		this.props.onPlayerControlVideoSpeedChange(s)
	}

	render() {
		const { playing, played, playbackRate, duration} = this.props
		return(
			<div>
				<Slider played={played} onSliderMouseUp={this.handleSliderMouseUp} onSliderMouseDown={this.handleSliderMouseDown} onSliderChange={this.handleSliderChange}/>
				<div className="d-flex mt-2">
					<div className="mr-auto d-flex align-items-center">
						<ButtonGroup>
							<Button className="player-button d-flex align-items-center" color="link" onClick={this.handleVideoRewind}><MdReplay style={{fontSize: '30px'}}/></Button>
							<Button className="player-button d-flex align-items-center"color="link" onClick={this.handleVideoPlayPause}>{playing ? <MdPause style={{fontSize: '30px'}}/> : <MdPlayArrow style={{fontSize: '30px'}}/>}</Button>
						</ButtonGroup>
						<Dropdown isOpen={this.state.dropdownOpen} toggle={this.handleSpeedToggle} size="sm">
							<DropdownToggle className={"speed-toggle d-flex align-items-center"} color={"link"} caret>
								x{playbackRate}
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem header className={''}>Speed</DropdownItem>
								<DropdownItem className={'speed-item'} onClick={()=>this.handleVideoSpeed(0.25)}>0.25</DropdownItem>
								<DropdownItem className={'speed-item'} onClick={()=>this.handleVideoSpeed(0.5)}>0.5</DropdownItem>
								<DropdownItem className={'speed-item'} onClick={()=>this.handleVideoSpeed(1)}>1</DropdownItem>
								<DropdownItem className={'speed-item'} onClick={()=>this.handleVideoSpeed(1.5)}>1.5</DropdownItem>
								<DropdownItem className={'speed-item'} onClick={()=>this.handleVideoSpeed(2)}>2</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
					<div className="d-flex align-items-center">
						<div><Duration seconds={played*duration}/> / <Duration seconds={duration}/></div>
					</div>
				</div>
			</div>
		);
	}
}

export default PlayerControl;
