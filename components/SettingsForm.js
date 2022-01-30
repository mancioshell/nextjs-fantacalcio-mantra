import { useState, useEffect } from "react";

import {
  Form,
  Button,
  Col,
  Row,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

function SettingsForm({ currentSettings }) {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const redeemTypes = [
    { name: "Intero", value: 1 },
    { name: "1/2 (Eccesso)", value: 2 },
    { name: "1/2 (Difetto)", value: 3 },
    { name: "1 Credito", value: 4 },
  ];

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

  const handleRadio = (redeemType) => setSettings(settings => ({...settings, redeemType}));

  const onChange = (e) => {
    setSettings(settings => ({ ...settings, [e.target.name]: e.target.value }));
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Col sm="2">
          <Form.Group controlId="maxAmount">
            <Form.Label>
              <b>Cassa Iniziale *</b> :
            </Form.Label>
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
            <Form.Label>
              <b>Minimo Numero di Giocatori *</b> :
            </Form.Label>
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
            <Form.Label>
              <b>Massimo Numero di Giocatori *</b> :
            </Form.Label>
            <Form.Control
              name="maxPlayersAmount"
              value={settings?.maxPlayersAmount || 0}
              type="number"
              placeholder="0"
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col sm="4" className="align-self-center">
          <Form.Group controlId="redeemType">
            <Form.Label>
              <b>Tipo di Svicnolo *</b> :
            </Form.Label>       

            <ToggleButtonGroup
              type="radio"
              name="redeemType"
              value={settings?.redeemType || 1 }
              onChange={handleRadio}
              className= "mr-3"
            >
              {redeemTypes.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  variant="outline-primary"
                  name="redeemType"
                  value={radio.value}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Form.Group>
        </Col>

        <Col sm="2" className="align-self-center">
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
