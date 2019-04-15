import React from 'react';

export default function Duration({ className, seconds }) {
	const style = { fontFamily: 'Courier' };
	return (
		<time dateTime={ `P${Math.round(seconds)}S` } className={ className } style={ style }>
			{format(seconds)}
		</time>
	);
}
const format = (seconds) => {
	const date = new Date(seconds * 1000);
	const hh = date.getUTCHours();
	const mm = pad(date.getUTCMinutes(), 2);
	const ss = pad(date.getUTCSeconds(), 2);
	const ms = pad(date.getUTCMilliseconds(), 3);
	if (hh) {
		return `${hh}:${mm}:${ss}:${ms}`;
	}
	return `${mm}:${ss}:${ms}`;
};
const pad = (string, digits) => ('0'.repeat(digits - 1) + string).slice(-digits);
