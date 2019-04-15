import React from 'react';

const colors = ['rgba(0,255,81,1)', 'rgba(255,219,0,1)', 'rgba(255,0,0,1)', 'rgba(0,4,255,1)', 'rgba(227,0,255,1)'];
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));


const Rounding = ({ className, number }) => {
	const style = { fontFamily: 'Courier' };
	return (
		<span className={ className } style={ style }>
			{Math.round(number)}
		</span>
	);
};

const interpolationArea = ({ startTraj, endTraj, played }) => {
	const lapseTime = endTraj.time - startTraj.time;
	const curTime = played - startTraj.time;
	const widthSlope = (endTraj.width - startTraj.width) / lapseTime;
	const heightSlope = (endTraj.height - startTraj.height) / lapseTime;
	const width = widthSlope * curTime + startTraj.width;
	const height = heightSlope * curTime + startTraj.height;
	return { width, height };
};

const interpolationPosition = ({ startTraj, endTraj, played }) => {
	const lapseTime = endTraj.time - startTraj.time;
	const curTime = played - startTraj.time;
	const xSlope = (endTraj.x - startTraj.x) / lapseTime;
	const ySlope = (endTraj.y - startTraj.y) / lapseTime;
	const x = xSlope * curTime + startTraj.x;
	const y = ySlope * curTime + startTraj.y;
	return { x, y };
};

export {
	colors, getRandomInt, Rounding, interpolationArea, interpolationPosition,
};
