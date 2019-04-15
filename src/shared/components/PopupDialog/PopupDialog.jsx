import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './PopupDialog.css';

const PopupDialog = ({
	isOpen, title, message, handleToggle,
}) => (
	<Modal isOpen={ isOpen } toggle={ handleToggle } backdrop='static'>
		<ModalHeader toggle={ handleToggle }>{title}</ModalHeader>
		<ModalBody>
			{message}
		</ModalBody>
		<ModalFooter>
			<Button color='secondary' onClick={ handleToggle }>Close</Button>
		</ModalFooter>
	</Modal>
);
PopupDialog.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string,
	handleToggle: PropTypes.func,
};
PopupDialog.defaultProps = {
	isOpen: false,
	title: '',
	message: '',
	handleToggle: () => {},
};

export default PopupDialog;
