import React from 'react';
import PropTypes from 'prop-types';

const pad = (string, digits) => ('0'.repeat(digits - 1) + string).slice(-digits);

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

const FormattedTime = ({ className, seconds }) => (
	<time dateTime={ `P${Math.round(seconds)}S` } className={ className }>
		{ format(seconds) }
	</time>
);

FormattedTime.propTypes = {
	className: PropTypes.string,
	seconds: PropTypes.number,
};
FormattedTime.defaultProps = {
	className: '',
	seconds: 0,
};

export default FormattedTime;
