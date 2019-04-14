import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './Screen.scss';

const Screen = ({
	className,
	playing,
	width,
	progressInterval,
	url,
	loop,
	playbackRate,
	onReady,
	onProgress,
	onDuration,
	onEnded,
	playerRef,
}) => (
	<ReactPlayer
		url={ url }
		playing={ playing }
		id='react-player'
		ref={ playerRef }
		onReady={ onReady }
		onProgress={ onProgress }
		onDuration={ onDuration }
		onEnded={ onEnded }
		className={ `${className} player-screen` }
		progressInterval={ progressInterval }
		controls={ false }
		muted
		loop={ loop }
		playbackRate={ playbackRate }
		width={ width }
		height='auto'
	/>
);

Screen.propTypes = {
	className: PropTypes.string,
	playing: PropTypes.bool,
	width: PropTypes.number,
	progressInterval: PropTypes.number,
	url: PropTypes.string,
	loop: PropTypes.bool,
	playbackRate: PropTypes.number,
	onReady: PropTypes.func,
	onProgress: PropTypes.func,
	onDuration: PropTypes.func,
	onEnded: PropTypes.func,
	playerRef: PropTypes.func,
};
Screen.defaultProps = {
	className: '',
	playing: false,
	width: 0,
	progressInterval: 100,
	url: '',
	loop: false,
	playbackRate: 1,
	onReady: () => {},
	onProgress: () => {},
	onDuration: () => {},
	onEnded: () => {},
	playerRef: () => {},
};

export default Screen;
