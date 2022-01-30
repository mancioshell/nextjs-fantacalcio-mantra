import { useSession } from "next-auth/client";

import Head from "next/head";

import useSWR, { useSWRConfig } from "swr";

import { Container, Col, Row } from "react-bootstrap";

import { Menu } from "../components/Menu";
import { Messages } from "../components/Messages";
import AccessDenied from "../components/Login";

import { AuctionForm } from "../components/AuctionForm";
import { RemovePlayerForm } from "../components/RemovePlayerForm";
import { UpdatePlayers } from "../components/UpdatePlayers";
import { SettingsForm } from "../components/SettingsForm";
import { UpdateTeamForm } from "../components/UpdateTeamForm";

import { UIProvider } from "../components/UIProvider";

export default function Auction() {
  const [session, loading] = useSession();

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { mutate } = useSWRConfig();

  const players = useSWR(`/api/players`, fetcher);
  const teams = useSWR(`/api/teams`, fetcher);
  const settings = useSWR(`/api/settings`, fetcher);

  const defaultSettings = {
    maxAmount: 0,
    minPlayersAmount: 0,
    maxPlayersAmount: 0,
    redeemType: 1,
  };

  if (!session) {
    return (
      <>
        <Head>
          <title>Gestione Asta</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Menu></Menu>

        <AccessDenied />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Gestione Asta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu></Menu>

      <UIProvider>
        <Container className="justify-content-md-center mt-5" fluid>
          <Messages></Messages>

          <Row>
            <Col sm={{ span: 10, offset: 1 }}>
              <header className="mt-4">
                <h1>
                  <i className="fas fa-gavel"></i> Gestione Asta
                </h1>
              </header>

              <hr className="mt-2"></hr>

              <section id="auction-form" className="mt-5">
                <h3>
                  <i className="fas fa-money-bill-wave"></i> Assegna Calciatore
                </h3>

                <hr className="mt-2"></hr>

                <AuctionForm
                  players={players}
                  teams={teams}
                  onAuction={() => {
                    mutate("/api/teams");
                  }}
                ></AuctionForm>
              </section>

              <section id="team-form" className="mt-5">
                <h3>
                  <i className="fas fa-trash"></i> Rimuovi Calciatore
                </h3>

                <hr className="mt-2"></hr>

                <RemovePlayerForm
                  teams={teams}
                  settings={settings.data || defaultSettings}
                  onRemovePlayer={() => {
                    mutate("/api/teams");
                  }}
                ></RemovePlayerForm>
              </section>

              <section id="settings-form" className="mt-5">
                <h3>
                  <i className="fas fa-cogs"></i> Impostazioni Lega
                </h3>

                <hr className="mt-2"></hr>

                <SettingsForm
                  currentSettings={settings?.data || defaultSettings}
                ></SettingsForm>
              </section>

              <section id="team-player-list-form" className="mt-5">
                <h3>
                  <i className="fas fa-futbol"></i> Aggiorna Squadre
                </h3>

                <hr className="mt-2"></hr>

                <UpdateTeamForm
                  teams={teams}
                  onUpdateTeam={() => {
                    mutate("/api/teams");
                  }}
                ></UpdateTeamForm>
              </section>

              <section id="player-list-form" className="mt-5">
                <h3>
                  <i className="fas fa-upload"></i> Aggiorna Lista Calciatori
                </h3>

                <hr className="mt-2"></hr>

                <UpdatePlayers
                  onUpdatedPlayers={() => {
                    mutate("/api/players");
                  }}
                ></UpdatePlayers>
              </section>
            </Col>
          </Row>
        </Container>
      </UIProvider>
    </>
  );
}
