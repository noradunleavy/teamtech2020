import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class ErrorModal extends Component {
    render() {
        return (
            <Modal show={this.props.showErrorModal} onHide={this.props.handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.errorText}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button className="view_button" onClick={this.props.handleModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ErrorModal;