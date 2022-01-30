import { useState, useEffect } from "react";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import { Form, Col, Row, Button, Spinner } from "react-bootstrap";

import Select from "react-select";

function UpdateTeamForm({ teams, onUpdateTeam }) {
  const ui = useContext(UIContext);

  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (team) {
      let currentTeam = teams.data.find((item) => item._id === team._id);
      setTeam(currentTeam);
    }
  }, [teams]);

  const teamOptions = teams.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const updateTeamById = async (teamId) => {
    const response = await fetch(`/api/teams/${teamId}/players`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  };

  const onUpdate = async () => {
    setIsLoading(true);
    await updateTeamById(team._id);
    setIsLoading(false);
    ui.addMessage({
      type: "success",
      text: "Squadra Aggiornata",
      title: "Asta",
    });
    onUpdateTeam();
  };

  return (
    <Form>
      <Row className="min-container">
        <Col sm="4">
          <Form.Group controlId={"select-team"}>
            <Form.Label>
              <b>Seleziona Squadra *</b> :
            </Form.Label>

            <Select
              inputId={`select-team`}
              options={teamOptions}
              isSearchable={true}
              name={"select-team"}
              value={
                teamOptions?.find((option) => option.value === team?._id) ||
                null
              }
              onChange={async (option) => {
                let teamId = option.value;
                let team = teams.data.find((team) => team._id === teamId);
                setTeam(team);
              }}
              required
              placeholder={"Seleziona Squadra"}
            />
          </Form.Group>
        </Col>
        <Col sm="2" className="align-self-center">
          {!isLoading ? (
            team ? (
              <Button
                className="mr-3 mt-3"
                variant="primary"
                type="button"
                onClick={onUpdate}
              >
                <i className="fas fa-arrow-circle-up"></i> Aggiorna
              </Button>
            ) : null
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
              Aggiornamento...
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export { UpdateTeamForm };

export default UpdateTeamForm;
