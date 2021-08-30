const xlsx = require("node-xlsx").default;
import { writeToBuffer } from "@fast-csv/format";

module.exports.api = {
  parseFile: async (file) => {
    const data = xlsx.parse(file);

    const players = data
      .filter((item) => item.name === "Tutti")
      .map((item) => {
        const tail = ([, , ...rest]) => rest;
        const data = tail(item.data).map((item) => ({
          id: item[0],
          roles: [...item[1].split(";")],
          name: item[2],
          team: item[3],
          quotation: item[4],
        }));
        return { name: item.name, data };
      })[0].data;

    return players;
  },
  getCsvBuffer: async (teams) => {
    let rows = [["$", "$", "$"]];

    for (let team of teams) {
      for (let player of team.players) {
        rows = [...rows, [team.name, player.id, player.price]];
      }
    }

    return writeToBuffer(rows);
  },
  getXlsBuffer: async (
    teams,
    { maxAmount, minPlayersAmount, maxPlayersAmount }
  ) => {
    let sheets = [];

    const options = {
      "!cols": [
        { wch: 6 },
        { wch: 20 },
        { wch: 20 },
        { wch: 6 },
        { wch: 5 },
        { wch: 8 },
        { wch: 15 },
        { wch: 12 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
      ],
    };

    for (let team of teams) {
      let columns = team.players.map((player) => [
        player.roles.join(";"),
        player.name,
        player.team,
        player.price,
      ]);

      let data = [
        [],
        [
          "",
          "",
          "",
          "",
          "",
          "Cassa",
          "Offerta Massima",
          "Cassa Iniziale",
          "Numero Minimo Giocatori",
          "Numero Massimo Giocatori",
          "Slot Min. Rimanenti",
          "Slot Max. Rimanenti",
          "Slot Occupati",
        ],
        [
          "",
          "",
          "",
          "",
          "",
          { f: "=H3 - SUM(D7:D100)" }, // F3: Left Amount
          { f: "= IF(INT(M3) < INT(I3), F3 - K3 + 1,F3)" }, // G3: Max Offer
          maxAmount, // H3: Initial Amount
          minPlayersAmount, // I3 : Min Number of Players
          maxPlayersAmount, // J3 : Max Number of Players
          { f: "= I3 - M3" }, // K3 : Min Slot Left
          { f: "= J3 - M3" }, // L3 : Max Slot Left
          { f: "= COUNT(D7:D100)" }, // M3 : Slot Occupati
        ],
        [],
        ["Ruoli", "Nome", "Squadra", "Prezzo"],
        [],
        ...columns,
      ];

      let sheet = { name: `${team.name}`, data: data };
      sheets = sheets.concat(sheet);
    }

    const buffer = xlsx.build(sheets, options);

    return buffer;
  },
};
