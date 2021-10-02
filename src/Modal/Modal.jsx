import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { Button } from "react-bootstrap";

const ModalTest = ({ muestro, coordenadas }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  return (
    <>
      {muestro && (
        <Button style={{position: "relative", top: coordenadas.y, left: coordenadas.x}} variant="primary" onClick={handleShow}>
          Show
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Testing</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalTest;
