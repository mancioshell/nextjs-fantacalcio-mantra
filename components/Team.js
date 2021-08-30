import { Table, Button, Col, Row, Alert } from "react-bootstrap";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import Roles from "./Roles";

function Team({ team, settings, onRemove }) {
  const ui = useContext(UIContext);

  const sendEmailToPresident = async () => {
    const response = await fetch(`/api/teams/${team._id}/emails`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await response.json();

    ui.addMessage({
      type: "success",
      text: `Email Inviata a ${team.email}`,
      title: "Email",
    });
  };

  const { maxAmount, minPlayersAmount, maxPlayersAmount } = settings;
  const players = team.players.map((player) => {
    let roles = <Roles roles={player.roles}></Roles>;

    return (
      <tr key={player.id}>
        <td>{roles}</td>
        <td>{player.name}</td>
        <td>{player.team}</td>
        <td>{player.price}</td>
        {onRemove ? (
          <td>
            <Button
              size="sm"
              variant="danger"
              type="button"
              onClick={() => onRemove(team._id, player.id)}
            >
              <i className="fas fa-trash"></i> Rimuovi
            </Button>
          </td>
        ) : null}
      </tr>
    );
  });

  const amount = team.players.reduce((curr, next) => curr + next.price, 0);
  let fund = maxAmount - amount;
  let maxOffer =
    team.players.length < minPlayersAmount
      ? fund - minPlayersAmount + team.players.length + 1
      : fund;

  return (
    <>
      <section id="team-players">
        <Row>
          <Col>
            <b>{team.name}</b>
          </Col>
          <Col>
            {!onRemove ? (
              <div className="float-right">
                <Button
                  size="sm"
                  variant="dark"
                  type="button"
                  target="_blank"
                  className="mr-2"
                  href={`/api/teams/${team._id}/players?type=csv`}
                  title="Rosa Squadra in CSV"
                >
                  <i className="fas fa-file-csv"></i>
                </Button>

                <Button
                  size="sm"
                  variant="success"
                  type="button"
                  target="_blank"
                  className="mr-2"
                  href={`/api/teams/${team._id}/players?type=excel`}
                  title="Rosa Squadra in Excel"
                >
                  <i className="fas fa-file-excel"></i>
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  type="button"
                  onClick={sendEmailToPresident}
                  title="Invia Rosa Squadra"
                >
                  <i className="fas fa-envelope"></i>
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>

        {players.length > 0 ? (
          <Table hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Ruoli</th>
                <th>Giocatore</th>
                <th>Squadra</th>
                <th>Prezzo</th>
                {onRemove ? <th>Azioni</th> : null}
              </tr>
            </thead>
            <tbody>{players}</tbody>
          </Table>
        ) : (
          <Alert variant="warning" className="mt-3">
            Nessun giocatore in Rosa
          </Alert>
        )}
      </section>

      {!onRemove ? (
        <section id="team-info">
          <Row className="mt-2">
            <Col>
              <b>Budget Iniziale :</b> {maxAmount}
            </Col>
            
          </Row>

          <Row className="mt-2">           

            <Col>
              <div>
                <b>Crediti Spesi :</b> {maxAmount - fund}
              </div>
            </Col>

            <Col>
              <div className="float-right">
                <b>Crediti Rimanenti :</b> {fund}
              </div>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <div>
                <b>Slot Occupati:</b> {team.players.length}
              </div>
            </Col>
            <Col>
              <div className="float-right">
                <b>Offerta Massima :</b> {maxOffer}
              </div>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <div>
                <b>Slot Min. Rimanenti: </b>
                {minPlayersAmount - team.players.length >= 0
                  ? minPlayersAmount - team.players.length
                  : 0}
              </div>
            </Col>
            <Col>
              <div className="float-right">
                <b>Slot Max. Rimanenti :</b>{" "}
                {maxPlayersAmount - team.players.length}
              </div>
            </Col>
          </Row>
        </section>
      ) : null}
    </>
  );
}

export { Team };

export default Team;
