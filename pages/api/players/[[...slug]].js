import nextConnect from "next-connect";
import multer from "multer";

import data from "../../../lib/data";
import xls from "../../../lib/xls";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const handler = nextConnect();

handler
  .post("/api/players", upload.single("players"), async (req, res) => {
    let file = req.file;
    let players = await xls.api.parseFile(file.buffer);

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
