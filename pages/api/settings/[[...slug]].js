import nextConnect from "next-connect";

import data from "../../../lib/data";

const handler = nextConnect();

handler
  .post("/api/settings", async (req, res) => {
    let settings = req.body;
    await data.api.insertSettings(settings);
    res.status(200).json({});
  })
  .get("/api/settings", async (req, res) => {    
    let settings = await data.api.getSettings()
    res.json(settings);
  });

export default handler;
