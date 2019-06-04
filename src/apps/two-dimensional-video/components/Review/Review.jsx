import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './review.scss';

const Review = ({
	className,
	height,
	onConfirmSubmit,
	onCancelSubmit,
}) => {
	const rootClassName = `d-flex align-items-center justify-content-center text-center${className ? ` ${className}` : ''}`;
	return (
		<div className={ rootClassName } style={ { height } }>
			<div>
				<div>The video is replaying</div>
				<div className='mb-2'>
					{'Make sure all the bounding boxes '}
					<b className='text-danger'>PRECISELY</b>
					{' bound the objects'}
				</div>
				<div>
					<Button className='mb-1' color='primary' onClick={ onCancelSubmit }>I want to adjust some boxes</Button>
					{' '}
					<Button className='mb-1' onClick={ onConfirmSubmit }>Everything is great! Submit it</Button>
				</div>
			</div>
		</div>
	);
};

Review.propTypes = {
	className: PropTypes.string,
	height: PropTypes.number,
	onConfirmSubmit: PropTypes.func,
	onCancelSubmit: PropTypes.func,
};
Review.defaultProps = {
	className: '',
	height: 0,
	onConfirmSubmit: () => {},
	onCancelSubmit: () => {},
};
export default Review;
