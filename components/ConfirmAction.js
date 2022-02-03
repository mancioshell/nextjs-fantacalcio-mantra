import { Modal, Button } from "react-bootstrap";

const ConfirmAction = ({
  show = false,
  title,
  message,
  closeLabel = "Annulla",
  actionLabel = "Conferma",
  onClose,
  onConfirm
}) => {  

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {closeLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {actionLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmAction;
