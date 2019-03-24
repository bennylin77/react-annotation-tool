import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './PopupDialog.css';

const PopupDialog = ({isOpen, title, message, handleToggle}) => {
    return (
        <Modal isOpen={isOpen} toggle={handleToggle} backdrop={'static'}>
                <ModalHeader toggle={handleToggle}>{title}</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={handleToggle}>Close</Button>
                </ModalFooter>
        </Modal>
    );
}
PopupDialog.propTypes = {
  isOpen: PropTypes.bool,
};
PopupDialog.defaultProps = {
  isOpen: false
};

export default PopupDialog;
