import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './screen.scss';

const Screen = ({
	className,
	isPlaying,
	width,
	progressInterval,
	url,
	isLoop,
	playbackRate,
	onReady,
	onProgress,
	onDuration,
	onEnded,
	playerRef,
}) => (
	<ReactPlayer
		url={ url }
		playing={ isPlaying }
		id='react-player'
		ref={ playerRef }
		onReady={ onReady }
		onProgress={ onProgress }
		onDuration={ onDuration }
		onEnded={ onEnded }
		className={ `player-screen${className ? ` ${className}` : ''}` }
		progressInterval={ progressInterval }
		controls={ false }
		muted
		loop={ isLoop }
		playbackRate={ playbackRate }
		width={ width }
		height='auto'
	/>
);

Screen.propTypes = {
	className: PropTypes.string,
	isPlaying: PropTypes.bool,
	width: PropTypes.number,
	progressInterval: PropTypes.number,
	url: PropTypes.string,
	isLoop: PropTypes.bool,
	playbackRate: PropTypes.number,
	onReady: PropTypes.func,
	onProgress: PropTypes.func,
	onDuration: PropTypes.func,
	onEnded: PropTypes.func,
	playerRef: PropTypes.func,
};
Screen.defaultProps = {
	className: '',
	isPlaying: false,
	width: 0,
	progressInterval: 100,
	url: '',
	isLoop: false,
	playbackRate: 1,
	onReady: () => {},
	onProgress: () => {},
	onDuration: () => {},
	onEnded: () => {},
	playerRef: () => {},
};

export default Screen;
