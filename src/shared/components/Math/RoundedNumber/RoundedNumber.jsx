import React from 'react';
import PropTypes from 'prop-types';
import './roundedNumber.scss';

const RoundedNumber = ({ className, number }) => {
	const rootClassName = `rounded-number${className ? ` ${className}` : ''}`;
	return (
		<span className={ rootClassName }>
			{Math.round(number)}
		</span>
	);
};

RoundedNumber.propTypes = {
	className: PropTypes.string,
	number: PropTypes.number,
};
RoundedNumber.defaultProps = {
	className: '',
	number: 0,
};
export default RoundedNumber;
