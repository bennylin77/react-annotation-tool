import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './popupDialog.scss';

const PopupDialog = ({
	isOpen,
	title,
	message,
	onToggle,
	onDontShowAgainChange,
	onYesClick,
	hasDontShowAgain,
	hasCloseButton,
	hasYesNoButton,
}) => (
	<Modal isOpen={ isOpen } toggle={ onToggle } backdrop='static'>
		<ModalHeader toggle={ onToggle }>{title}</ModalHeader>
		<ModalBody>
			{message}
		</ModalBody>
		<ModalFooter>
			{ hasDontShowAgain && (
				<div className='d-flex align-items-center'>
					<Label check>
						<Input type='checkbox' onChange={ onDontShowAgainChange } />
						{'Don\'t show again'}
					</Label>
				</div>
			)}
			{ hasYesNoButton && (
				<Fragment>
					<Button color='primary' onClick={ onYesClick }>Yes</Button>
					<Button color='secondary' onClick={ onToggle }>No</Button>
				</Fragment>
			)}
			{ hasCloseButton && <Button color='secondary' onClick={ onToggle }>Close</Button>}
		</ModalFooter>
	</Modal>
);
PopupDialog.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string,
	hasDontShowAgain: PropTypes.bool,
	hasCloseButton: PropTypes.bool,
	hasYesNoButton: PropTypes.bool,
	onToggle: PropTypes.func,
	onYesClick: PropTypes.func,
	onDontShowAgainChange: PropTypes.func,
};
PopupDialog.defaultProps = {
	isOpen: false,
	title: '',
	message: '',
	hasDontShowAgain: false,
	hasCloseButton: false,
	hasYesNoButton: false,
	onToggle: () => {},
	onYesClick: () => {},
	onDontShowAgainChange: () => {},
};

export default PopupDialog;
