import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './preview.scss';

const Preview = ({
	className,
	header,
	notices,
	height,
	onPreviewClick,
}) => {
	const items = notices.map(n => <li key={ n } dangerouslySetInnerHTML={ { __html: n } } />);
	const rootClassName = `d-flex align-items-center justify-content-center preview${className ? ` ${className}` : ''}`;
	return (
		<div className={ rootClassName } style={ { height } }>
			<div>
				<div className='mb-4'>{header}</div>
				<ul className='text-left preview__list mb-5 pl-4'>
					{ items }
				</ul>
				<Button color='primary' onClick={ onPreviewClick }>Scanned the video and ready to start</Button>
			</div>
		</div>
	);
};

Preview.propTypes = {
	className: PropTypes.string,
	header: PropTypes.string,
	notices: PropTypes.arrayOf(PropTypes.string),
	height: PropTypes.number,
	onPreviewClick: PropTypes.func,
};
Preview.defaultProps = {
	className: '',
	header: '',
	notices: [],
	height: 0,
	onPreviewClick: () => {},
};

export default Preview;
