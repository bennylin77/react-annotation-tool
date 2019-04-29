import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './PopupDialog.scss';

const PopupDialog = ({
	isOpen,
	title,
	message,
	handleToggle,
	handleDontShowAgainChange,
	handleYesClick,
	enableDontShowAgain,
	enableCloseButton,
	enableYesNoButton,
}) => (
	<Modal isOpen={ isOpen } toggle={ handleToggle } backdrop='static'>
		<ModalHeader toggle={ handleToggle }>{title}</ModalHeader>
		<ModalBody>
			{message}
		</ModalBody>
		<ModalFooter>
			{ enableDontShowAgain && (
				<div className='d-flex align-items-center'>
					<Label check>
						<Input type='checkbox' onChange={ handleDontShowAgainChange } />
						{'Don\'t show again'}
					</Label>
				</div>
			)}
			{ enableYesNoButton && (
				<Fragment>
					<Button color='primary' onClick={ handleYesClick }>Yes</Button>
					<Button color='secondary' onClick={ handleToggle }>No</Button>
				</Fragment>
			)}
			{ enableCloseButton && <Button color='secondary' onClick={ handleToggle }>Close</Button>}
		</ModalFooter>
	</Modal>
);
PopupDialog.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string,
	enableDontShowAgain: PropTypes.bool,
	enableCloseButton: PropTypes.bool,
	enableYesNoButton: PropTypes.bool,
	handleToggle: PropTypes.func,
	handleYesClick: PropTypes.func,
	handleDontShowAgainChange: PropTypes.func,
};
PopupDialog.defaultProps = {
	isOpen: false,
	title: '',
	message: '',
	enableDontShowAgain: false,
	enableCloseButton: false,
	enableYesNoButton: false,
	handleToggle: () => {},
	handleYesClick: () => {},
	handleDontShowAgainChange: () => {},
};

export default PopupDialog;
