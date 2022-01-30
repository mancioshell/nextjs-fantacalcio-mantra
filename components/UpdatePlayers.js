import { useState, useRef } from "react";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import { Col, Row, Button, Spinner } from "react-bootstrap";

function UpdatePlayers({ onUpdatedPlayers }) {
  const ui = useContext(UIContext);

  const [isLoading, setIsLoading] = useState(false);

  const updatePlayers = async () => {
    const response = await fetch(`/api/players`, {
      method: "POST",
    });
  };

  const onUpdate = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await updatePlayers();
    setIsLoading(false);

    ui.addMessage({
      type: "success",
      text: "Lista Aggiornata con Successo",
      title: "Lista Giocatori",
    });

    onUpdatedPlayers();
  };

  return (
    <Row className="min-container">
      <Col sm="2" className="align-self-center">
        {!isLoading ? (
          <Button
            className="mr-3 mt-3 mb-3"
            variant="primary"
            type="button"
            onClick={onUpdate}
          >
            <i className="fas fa-upload"></i> Aggiorna
          </Button>
        ) : (
          <Button className="mr-3 mt-3 mb-3" variant="primary" disabled>
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
  );
}

export { UpdatePlayers };

export default UpdatePlayers;
