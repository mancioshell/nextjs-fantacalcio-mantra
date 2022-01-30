import nextConnect from "next-connect";

import data from "../../../lib/data";
import xls from "../../../lib/xls";
import axios from "axios";

const handler = nextConnect();

handler
  .post("/api/players", async (req, res) => {
    let response = await axios({
      method: "GET",
      url: "https://www.fantacalcio.it//Servizi/Excel.ashx?type=0&r=3&t=1643465818000",
      responseType: "arraybuffer"
    });

    let file = response.data;
    let players = await xls.api.parseFile(file);

    await data.api.insertPlayers(players);

    res.status(200).json({});

  })
  .get("/api/players", async (req, res) => {
    let players = await data.api.getPlayers();
    res.json(players);
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
