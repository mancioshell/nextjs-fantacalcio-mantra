import Head from "next/head";

import useSWR, { useSWRConfig } from "swr";

import { Container, Row, Col, Button } from "react-bootstrap";

import { useContext } from "react";
import UIContext from "../context/UIContext";

import { Menu } from "../components/Menu";
import { Messages } from "../components/Messages";
import { Team } from "../components/Team";

import { UIProvider } from "../components/UIProvider";

export default function Teams() {
  const ui = useContext(UIContext);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { mutate } = useSWRConfig();

  const teams = useSWR(`/api/teams`, fetcher, { refreshInterval: 1000 });
  const settings = useSWR(`/api/settings`, fetcher);

  const sendEmailToPresidents = async () => {
    const response = await fetch(`/api/teams/emails`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await response.json();

    ui.addMessage({
      type: "success",
      text: "Email Inviate",
      title: "Email",
    });
  };

  const redeemPlayerFromTeam = async (teamId, playerId) => {
    const response = await fetch(
      `/api/teams/${teamId}/players/${playerId}?action=redeem`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  };

  const onRedeem = async (teamId, playerId) => {
    await redeemPlayerFromTeam(teamId, playerId);
    ui.addMessage({
      type: "success",
      text: "Calciatore Svincolato",
      title: "Asta",
    });
    mutate("/api/teams");
  };

  let Teams = teams.data?.map((item, index) => (
    <Col className="mt-3 mb-5" md="4" sm="3" key={item._id}>
      <Team
        team={item}
        settings={
          settings?.data || {
            maxAmount: 0,
            minPlayersAmount: 0,
            maxPlayersAmount: 0,
          }
        }
        onRedeem={onRedeem}
      ></Team>
    </Col>
  ));
  return (
    <>
      <Head>
        <title>Rose Squadre</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu></Menu>

      <UIProvider>
        <Container className="justify-content-md-center mt-5" fluid>
          <Messages></Messages>

          <Row>
            <Col sm={{ span: 10, offset: 1 }}>
              <header className="mt-4">
                <Row>
                  <Col>
                    <h1>
                      <i className="fas fa-futbol"></i> Rose Squadre
                    </h1>
                  </Col>
                  <Col>
                    <div className="float-right mt-3">
                      <Button
                        variant="dark"
                        type="button"
                        target="_blank"
                        className="mr-2"
                        href={`/api/teams/players?type=csv`}
                        title="Rose Squadre in CSV"
                      >
                        <i className="fas fa-file-csv"></i>
                      </Button>
                      <Button
                        variant="success"
                        type="button"
                        className="mr-2"
                        target="_blank"
                        href={`/api/teams/players?type=excel`}
                        title="Rose Squadre in Excel"
                      >
                        <i className="fas fa-file-excel"></i>
                      </Button>

                      <Button
                        variant="danger"
                        type="button"
                        onClick={sendEmailToPresidents}
                        title="Invia Rose Squadre"
                      >
                        <i className="fas fa-envelope"></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </header>

              <hr className="mt-2"></hr>

              <section id="teams">
                <Row>{Teams}</Row>
              </section>
            </Col>
          </Row>
        </Container>
      </UIProvider>
    </>
  );
}
