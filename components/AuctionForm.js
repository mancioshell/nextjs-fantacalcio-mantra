import { useState } from "react";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import { Form, Button, Col, Row } from "react-bootstrap";

import Roles, { roles } from "./Roles";

import Select from "react-select";

function AuctionForm({ players, teams, onAuction }) {
  const ui = useContext(UIContext);

  let allPlayers = teams.data
    ?.map((team) => team.players)
    .reduce((curr, next) => curr.concat(next))
    .map((player) => player.id);

  const playerOptions = players.data
    ?.filter((player) => !allPlayers?.includes(player.id))
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
        roles: item.roles,
        team: item.team,
        quotation: item.quotation,
      };
    });

  const teamOptions = teams.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const roleOptions = roles.map((item, index) => ({
    value: item,
    label: item,
  }));

  const initState = {
    price: 0,
    playerId: null,
    teamId: null,
  };

  const [auction, setAuction] = useState({ ...initState });
  const [rolesFilter, setRolesFilter] = useState([]);

  const addPlayerToTeam = async () => {
    if (auction.teamId && auction.playerId && auction.price > 0) {
      const response = await fetch(
        `/api/teams/${auction.teamId}/players/${auction.playerId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: auction.price }),
        }
      );
      return response.json();
    } else {
      return {
        error:
          "Devi selezionare un calciatore, una squadra ed inserire un prezzo valido.",
      };
    }
  };

  const onChange = (e) => {
    setAuction({ ...auction, price: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let result = await addPlayerToTeam();

    if (!result.error) {
      setAuction(initState);
      ui.addMessage({
        type: "success",
        text: "Calciatore Aggiudicato",
        title: "Asta",
      });
      onAuction();
    } else {
      ui.addMessage({
        type: "danger",
        text: result.error,
        title: "Asta",
      });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row className="min-container">
        <Col sm="5">
          <Form.Group controlId={"select-player"}>
            <Form.Label>
              <b>Filtra per Ruoli</b> :
            </Form.Label>

            <Select
              inputId={`filter-roles`}
              options={roleOptions}
              isMulti={true}
              isSearchable={true}
              name={"filter-roles"}
              formatOptionLabel={function (data) {
                return <Roles roles={[data.value]}></Roles>;
              }}
              onChange={(options) => {
                setRolesFilter(options);
              }}
              placeholder={"Filtra per Ruolo"}
            />
          </Form.Group>
        </Col>

        <Col sm="4">
          <Form.Group controlId={"select-player"}>
            <Form.Label>
              <b>Seleziona Calciatore *</b> :
            </Form.Label>

            <Select
              inputId={`select-player`}
              options={playerOptions?.filter((player) => {
                if (rolesFilter.length <= 0) return true;

                let filtered = rolesFilter.filter((role) => {
                  let result = player.roles.find((elem) => elem === role.value);
                  return result;
                });

                return filtered.length > 0;
              })}
              isSearchable={true}
              name={"select-player"}
              formatOptionLabel={function (data) {
                return (
                  <>
                    {data.label} <Roles roles={data.roles}></Roles> -{" "}
                    {data.team}
                  </>
                );
              }}
              value={
                playerOptions?.find(
                  (player) => player.value === auction.playerId
                ) || null
              }
              onChange={(option) => {
                setAuction({ ...auction, playerId: option.value });
              }}
              required
              placeholder={"Seleziona Calciatore"}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="min-container">
        <Col sm="3">
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
                teamOptions?.find((team) => team.value === auction.teamId) ||
                null
              }
              onChange={(option) => {
                setAuction({ ...auction, teamId: option.value });
              }}
              required
              placeholder={"Seleziona Squadra"}
            />
          </Form.Group>
        </Col>

        <Col sm="2">
          <Form.Group controlId="price">
            <Form.Label>
              <b>Prezzo *</b> :
            </Form.Label>
            <Form.Control
              value={auction.price}
              type="number"
              placeholder="0"
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col sm="2" className="align-self-center">
          <Button className="mr-3 mt-3" variant="primary" type="submit">
            <i className="fas fa-gavel"></i> Assegna
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export { AuctionForm };

export default AuctionForm;
