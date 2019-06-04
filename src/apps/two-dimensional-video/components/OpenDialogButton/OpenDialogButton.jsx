import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import PopupDialog from 'shared/components/PopupDialog/PopupDialog.jsx';

const OpenDialogButton = ({
	className,
	color,
	outline,
	children,
	title,
	message,
	isDialogDisabled,
	onYesClick,
	onDontShowAgainChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Fragment>
			<Button
				outline={ outline }
				className={ className }
				color={ color }
				onClick={ () => {
					if (isDialogDisabled) {
						onYesClick();
					}
					setIsOpen(true);
				} }
			>
				{children}
			</Button>
			<PopupDialog
				isOpen={ isOpen }
				title={ title }
				message={ message }
				onToggle={ () => setIsOpen(!isOpen) }
				onYesClick={ onYesClick }
				onDontShowAgainChange={ onDontShowAgainChange }
				hasDontShowAgain
				hasYesNoButton
			/>
		</Fragment>
	);
};

OpenDialogButton.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	color: PropTypes.string,
	outline: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string,
	isDialogDisabled: PropTypes.bool,
	onYesClick: PropTypes.func,
	onDontShowAgainChange: PropTypes.func,
};
OpenDialogButton.defaultProps = {
	className: '',
	children: null,
	color: 'secondary',
	outline: false,
	title: '',
	message: '',
	isDialogDisabled: false,
	onYesClick: () => {},
	onDontShowAgainChange: () => {},
};
export default OpenDialogButton;
