import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeleteSoundModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {props.soundData?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are about to delete this sound forever.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => props.callback(props.soundData)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteSoundModal.propTypes = {
  show: PropTypes.bool,
  soundData: PropTypes.object,
  callback: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default DeleteSoundModal;
