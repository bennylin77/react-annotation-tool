import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TwoDimensionalVideoContext from '../TwoDimensionalVideo/twoDimensionalVideoContext';
import VideoPlayerScreen from '../VideoPlayer/Screen/Screen.jsx';
import VideoPlayerControl from '../VideoPlayer/Control/Control.jsx';
import Canvas from '../Canvas/Canvas.jsx';
import './drawableVideoPlayer.scss';

const DrawableVideoPlayer = ({
	className,
}) => {
	const twoDimensionalVideoContext = useContext(TwoDimensionalVideoContext);
	const {
		url,
		played,
		isPlaying,
		playbackRate,
		isLoop,
		entities,
		annotations,
		focusing,
		width,
		height,
		duration,
		isAdding,
		isEmptyCheckEnable,
		playerRef,
		onVideoReady,
		onVideoProgress,
		onVideoDuration,
		onVideoEnded,
		onVideoSliderMouseUp,
		onVideoSliderMouseDown,
		onVideoSliderChange,
		onVideoRewind,
		onVideoPlayPause,
		onVideoSpeedChange,
		onCanvasStageMouseDown,
		onCanvasGroupMouseDown,
		onCanvasGroupDragEnd,
		onCanvasDotMouseDown,
		onCanvasDotDragEnd,
	} = twoDimensionalVideoContext;

	const rootClassName = `drawable-video-player${className ? ` ${className}` : ''}`;
	return (
		<div className={ rootClassName }>
			<div className='drawable-video-player__player-canvas-wrapper'>
				<VideoPlayerScreen
					playerRef={ playerRef }
					onReady={ onVideoReady }
					onProgress={ onVideoProgress }
					onDuration={ onVideoDuration }
					onEnded={ onVideoEnded }
					url={ url }
					width={ width }
					isPlaying={ isPlaying }
					isLoop={ isLoop }
					playbackRate={ playbackRate }
				/>
				<Canvas
					width={ width }
					height={ height }
					played={ played }
					focusing={ focusing }
					isAdding={ isAdding }
					entities={ entities }
					annotations={ annotations }
					onStageMouseDown={ onCanvasStageMouseDown }
					onGroupMouseDown={ onCanvasGroupMouseDown }
					onGroupDragEnd={ onCanvasGroupDragEnd }
					onDotMouseDown={ onCanvasDotMouseDown }
					onDotDragEnd={ onCanvasDotDragEnd }
					isEmptyCheckEnable={ isEmptyCheckEnable }
				/>
			</div>
			<VideoPlayerControl
				isPlaying={ isPlaying }
				played={ played }
				playbackRate={ playbackRate }
				duration={ duration }
				onSliderMouseUp={ onVideoSliderMouseUp }
				onSliderMouseDown={ onVideoSliderMouseDown }
				onSliderChange={ onVideoSliderChange }
				onRewind={ onVideoRewind }
				onPlayPause={ onVideoPlayPause }
				onSpeedChange={ onVideoSpeedChange }
			/>
		</div>
	);
};

DrawableVideoPlayer.propTypes = {
	className: PropTypes.string,
};
DrawableVideoPlayer.defaultProps = {
	className: '',
};
export default DrawableVideoPlayer;
