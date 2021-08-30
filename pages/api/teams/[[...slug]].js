import nextConnect from "next-connect";

import stream from "stream";

import data from "../../../lib/data";
import xls from "../../../lib/xls";
import { sendEmail } from "../../../lib/mail";

import {
  PlayerAlreadyInTeam,
  MaxOfferOverflow,
  MaxPlayersAlreadyBought,
} from "../../../lib/errors";

function onError(err, req, res, next) {
  let code = 500;
  if (err instanceof PlayerAlreadyInTeam) code = 403;
  if (err instanceof MaxOfferOverflow) code = 403;
  if (err instanceof MaxPlayersAlreadyBought) code = 403;
  console.error(err);
  res.status(code).json({ error: err.message });
}

const handler = nextConnect({ attachParams: true, onError });

handler
  .put("/api/teams/emails", async (req, res) => {
    let teams = await data.api.getTeams();
    let settings = await data.api.getSettings();

    let fileContents = await xls.api.getXlsBuffer(teams, settings);    

    for (let team of teams) {
      await sendEmail(team, fileContents, true);
    }

    res.status(200).json({});
  })
  .put("/api/teams/:teamId/emails", async (req, res) => {
    let teamId = req.params.teamId;
    let team = await data.api.getTeamById(teamId);
    let settings = await data.api.getSettings();

    let fileContents = await xls.api.getXlsBuffer([team], settings);

    await sendEmail(team, fileContents);

    res.status(200).json({});
  })
  .post("/api/teams/:teamId/players/:playerId", async (req, res) => {
    let teamId = req.params.teamId;
    let playerId = parseInt(req.params.playerId);
    let price = parseInt(req.body.price);

    let result = await data.api.insertPlayerInTeams(teamId, playerId, price);
    res.status(201).json({ inserted: result });
  })
  .post("/api/teams", async (req, res) => {
    let team = req.body;
    let result = await data.api.insertTeam(team);
    res.json(result);
  })
  .get("/api/teams", async (req, res) => {
    let teams = await data.api.getTeams();
    res.status(200).json(teams);
  })
  .get("/api/teams/players", async (req, res) => {
    let type = req.query.type;

    let teams = await data.api.getTeams();

    const readStream = new stream.PassThrough();

    if (type === "csv") {
      let csvBuffer = await xls.api.getCsvBuffer(teams);
      readStream.end(csvBuffer);

      res.setHeader(
        "Content-disposition",
        `attachment; filename=Rose_Squadre.csv`
      );
      res.setHeader("Content-Type", "text/csv");

      readStream.pipe(res);
    } else {
      let settings = await data.api.getSettings();
      let fileContents = await xls.api.getXlsBuffer(teams, settings);

      readStream.end(fileContents);

      res.setHeader(
        "Content-disposition",
        `attachment; filename=Rose_Squadre.xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    }

    readStream.pipe(res);
  })
  .get("/api/teams/:teamId", async (req, res) => {
    let teamId = req.params.teamId;
    let team = await data.api.getTeamById(teamId);
    res.json(team);
  })
  .delete("/api/teams/:teamId/players/:playerId", async (req, res) => {
    let teamId = req.params.teamId;
    let playerId = parseInt(req.params.playerId);
    await data.api.removePlayerFromTeam(teamId, playerId);
    res.json({});
  })
  .get("/api/teams/:teamId/players", async (req, res) => {
    let type = req.query.type;
    let teamId = req.params.teamId;

    let team = await data.api.getTeamById(teamId);

    const readStream = new stream.PassThrough();

    if (type === "csv") {
      let csvBuffer = await xls.api.getCsvBuffer([team]);

      readStream.end(csvBuffer);

      res.setHeader(
        "Content-disposition",
        `attachment; filename=${team.name}.csv`
      );
      res.setHeader("Content-Type", "text/csv");
    } else {
      let settings = await data.api.getSettings();
      let fileContents = await xls.api.getXlsBuffer([team], settings);

      readStream.end(fileContents);

      res.setHeader(
        "Content-disposition",
        `attachment; filename=${team.name}.xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    }

    readStream.pipe(res);
  });

export default handler;
