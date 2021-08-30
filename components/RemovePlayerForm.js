import { useState, useEffect } from "react";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import { Team } from "../components/Team";

import { Form, Col, Row } from "react-bootstrap";

import Select from "react-select";

function RemovePlayerForm({ teams, settings, onRemovePlayer }) {
  const ui = useContext(UIContext);

  const [team, setTeam] = useState(null);

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

  const removePlayerFromTeam = async (teamId, playerId) => {
    const response = await fetch(`/api/teams/${teamId}/players/${playerId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  };

  const onRemove = async (teamId, playerId) => {
    await removePlayerFromTeam(teamId, playerId);
    ui.addMessage({
      type: "success",
      text: "Calciatore Rimosso",
      title: "Asta",
    });
    onRemovePlayer();
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
        <Col sm="8">
          {team ? (
            <Team team={team} settings={settings} onRemove={onRemove}></Team>
          ) : null}
        </Col>
      </Row>
    </Form>
  );
}

export { RemovePlayerForm };

export default RemovePlayerForm;
