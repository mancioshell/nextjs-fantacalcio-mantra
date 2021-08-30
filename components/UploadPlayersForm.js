import { useState, useRef } from "react";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import { Form, Col, Row, Button, Spinner } from "react-bootstrap";

function UploadPlayersForm({ onUploadPlayers }) {
  const ui = useContext(UIContext);

  const fileRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadPlayers = async (formData) => {
    const response = await fetch(`/api/players`, {
      method: "POST",
      body: formData,
    });
  };

  const onChangeFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("players", selectedFile);
    setIsLoading(true);
    await uploadPlayers(formData);
    setIsLoading(false);

    fileRef.current.value = null;
    setSelectedFile(null);

    ui.addMessage({
      type: "success",
      text: "Lista Caricata con Successo",
      title: "Lista Giocatori",
    });

    onUploadPlayers();
  };

  return (
    <Form onSubmit={onUpload}>
      <Row className="min-container">
        <Col sm="4">
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              <b>Carica la lista delle quotazioni *</b> :
            </Form.Label>
            <Form.Control type="file" ref={fileRef} onChange={onChangeFile} />
          </Form.Group>
        </Col>

        <Col sm="2" className="align-self-center">
          {!isLoading ? (
            <Button className="mr-3 mt-3" variant="primary" type="submit">
              <i className="fas fa-upload"></i> Aggiorna
            </Button>
          ) : (
            <Button className="mr-3 mt-3" variant="primary" disabled>
              <Spinner
                className="mr-2"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Caricamento...
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export { UploadPlayersForm };

export default UploadPlayersForm;
