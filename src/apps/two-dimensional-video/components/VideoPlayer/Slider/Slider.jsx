import React from 'react';
import PropTypes from 'prop-types';
import './Slider.scss';

const Slider = ({
	className, onMouseUp, onMouseDown, onChange, played,
}) => (
	<div className={ `${className} player-slider` }>
		<input
			type='range'
			min={ 0 }
			max={ 1 }
			step='any'
			value={ played }
			onMouseUp={ onMouseUp }
			onMouseDown={ onMouseDown }
			onChange={ onChange }
			onInput={ onChange }
		/>
	</div>
);

Slider.propTypes = {
	className: PropTypes.string,
	onMouseUp: PropTypes.func,
	onMouseDown: PropTypes.func,
	onChange: PropTypes.func,
	played: PropTypes.number,
};
Slider.defaultProps = {
	className: '',
	onMouseUp: () => {},
	onMouseDown: () => {},
	onChange: () => {},
	played: 0,
};

export default Slider;
