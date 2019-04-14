import React from 'react'

const Rounding = ({ className, number }) => {
	const style = {fontFamily: "Courier"}
  return (
    <span className={className} style={style}>
      {Math.round(number)}
    </span>
  )
}

const interpolationArea = ({ startTraj, endTraj, played }) => {
	let lapseTime = endTraj.time - startTraj.time;
	let curTime = played - startTraj.time;
	let widthSlope = (endTraj.width - startTraj.width)/lapseTime
	let heightSlope = (endTraj.height - startTraj.height)/lapseTime
	let width = widthSlope * curTime + startTraj.width
	let height = heightSlope * curTime + startTraj.height
	return { width: width, height: height}
}

const interpolationPosition = ({ startTraj, endTraj, played }) => {
	let lapseTime = endTraj.time - startTraj.time;
	let curTime = played - startTraj.time;
	let xSlope = (endTraj.x - startTraj.x)/lapseTime;
	let ySlope = (endTraj.y - startTraj.y)/lapseTime;
	let x = xSlope * curTime + startTraj.x;
	let y = ySlope * curTime + startTraj.y;
	return { x: x, y: y}
}

export {Rounding, interpolationArea, interpolationPosition}
