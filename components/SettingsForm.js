import { useState, useEffect } from "react";

import { Form, Button, Col, Row } from "react-bootstrap";

function SettingsForm({ currentSettings }) {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const saveSettings = async () => {
    const response = await fetch(`/api/settings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
    return response.json();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await saveSettings();
  };

  const onChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Col sm="3">
          <Form.Group controlId="maxAmount">
            <Form.Label><b>Cassa Iniziale *</b> :</Form.Label>
            <Form.Control
              name="maxAmount"
              value={settings?.maxAmount || 0}
              type="number"
              placeholder="0"
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col sm="3">
          <Form.Group controlId="minPlayersAmount">
            <Form.Label><b>Minimo Numero di Giocatori *</b> :</Form.Label>
            <Form.Control
              name="minPlayersAmount"
              value={settings?.minPlayersAmount || 0}
              type="number"
              placeholder="0"
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col sm="3">
          <Form.Group controlId="maxPlayersAmount">
            <Form.Label><b>Massimo Numero di Giocatori *</b> :</Form.Label>
            <Form.Control
              name="maxPlayersAmount"
              value={settings?.maxPlayersAmount || 0}
              type="number"
              placeholder="0"
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col sm="3" className="align-self-center">
          <Button className="mr-3 mt-3" variant="primary" type="submit">
            <i className="fas fa-cogs"></i> Salva
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export { SettingsForm };

export default SettingsForm;
