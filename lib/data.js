const { getConnection, ObjectId } = require("./db");

import {
  PlayerAlreadyInTeam,
  MaxOfferOverflow,
  MaxPlayersAlreadyBought,
} from "./errors";

const computeRedeem = (redeemType, price) => {
  const redeemMap = {
    1: () => price,
    2: () => Math.ceil(price / 2),
    3: () => Math.floor(price / 2),
    4: () => 1,
  };
  return redeemMap[redeemType]();
};

let getCollection = async (collectionNameList) => {
  let { database, client } = await getConnection();
  let collections = collectionNameList.map((collectionName) =>
    database.collection(collectionName)
  );
  return [...collections, client.startSession()];
};

module.exports.api = {
  insertSettings: async ({
    maxAmount,
    minPlayersAmount,
    maxPlayersAmount,
    redeemType,
  }) => {
    let [settings] = await getCollection(["settings"]);

    return settings.updateOne(
      { id: "settings" },
      { $set: { maxAmount, minPlayersAmount, maxPlayersAmount, redeemType } },
      { upsert: true }
    );
  },
  getSettings: async () => {
    let [settings] = await getCollection(["settings"]);
    return settings.findOne({ id: "settings" });
  },
  insertTeam: async ({ name, president, email }) => {
    let [teams] = await getCollection(["teams"]);
    return teams.insert({
      name,
      president,
      email,
      players: [],
      redeemAmount: 0,
    });
  },
  updateTeamById: async (teamId) => {
    let [teams, players, session] = await getCollection(["teams", "players"]);

    try {
      session.startTransaction();

      let currentTeam = await teams.findOne({ _id: new ObjectId(teamId) });

      let playerList = await Promise.all(
        currentTeam.players.map(async (player) => {
          let { quotation, roles, team } = await players.findOne({
            id: player.id,
          });
          return { ...player, quotation, roles, team };
        })
      );

      let result = await teams.updateOne(
        { _id: new ObjectId(teamId) },
        { $set: { players: playerList } }
      );

      await session.commitTransaction();

      return result;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
  getTeams: async () => {
    let [teams] = await getCollection(["teams"]);
    let allTeams = await teams.find({});
    allTeams = await allTeams.toArray();

    return allTeams;
  },
  getTeamById: async (teamId) => {
    let [teams] = await getCollection(["teams"]);
    let team = await teams.findOne({ _id: new ObjectId(teamId) });

    return team;
  },
  removeTeamById: async (teamId) => {
    let [teams] = await getCollection(["teams"]);
    return teams.removeOne({ _id: new ObjectId(teamId) });
  },
  insertPlayers: async (playerList) => {
    let [players] = await getCollection(["players"]);

    const queries = playerList.map(({ id, name, roles, team, quotation }) => ({
      updateOne: {
        filter: { id },
        update: { $set: { id, name, roles, team, quotation } },
        upsert: true,
      },
    }));

    return await players.bulkWrite(queries);
  },
  getPlayers: async () => {
    let [players] = await getCollection(["players"]);
    let allPlayers = await players.find({});
    allPlayers = await allPlayers.toArray();
    return allPlayers;
  },
  insertPlayerInTeams: async (teamId, playerId, price) => {
    let [settings, teams, players, session] = await getCollection([
      "settings",
      "teams",
      "players",
    ]);

    try {
      session.startTransaction();

      let currentPlayer = await players.findOne({ id: playerId });
      let currentTeam = await teams.findOne({ _id: new ObjectId(teamId) });
      let currentSettings = await settings.findOne({ id: "settings" });

      let allTeams = await teams.find({});
      allTeams = await allTeams.toArray();

      let maxAmount = currentSettings.maxAmount;
      let minPlayersAmount = currentSettings.minPlayersAmount;
      let maxPlayersAmount = currentSettings.maxPlayersAmount;

      let redeemAmount = currentTeam.redeemAmount;

      let amount = currentTeam.players.reduce(
        (curr, next) => curr + next.price,
        0
      );

      let allPlayers = allTeams
        .map((team) => team.players)
        .reduce((curr, next) => curr.concat(next));

      let founded = allPlayers.find((player) => player.id === playerId);

      let fund = maxAmount - amount - redeemAmount;
      let maxOffer =
        currentTeam.players.length < minPlayersAmount
          ? fund - minPlayersAmount + currentTeam.players.length + 1
          : fund;

      if (founded)
        throw new PlayerAlreadyInTeam("Il Calciatore fa già parte di una rosa");

      if (price > maxOffer)
        throw new MaxOfferOverflow("Offerta massima superata");

      if (currentTeam.players.length + 1 > maxPlayersAmount)
        throw new MaxPlayersAlreadyBought(
          "Superato il limite massimo di calciatori in rosa"
        );

      let result = await teams.updateOne(
        { _id: new ObjectId(teamId) },
        { $push: { players: { ...currentPlayer, price } } }
      );

      await session.commitTransaction();

      return result;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
  removePlayerFromTeam: async (teamId, playerId, action) => {
    let [teams, settings, session] = await getCollection(["teams", "settings"]);

    try {
      session.startTransaction();

      let currentSettings = await settings.findOne({ id: "settings" });
      let redeemType = currentSettings.redeemType;

      let currentTeam = await teams.findOne({ _id: new ObjectId(teamId) });
      let currentPlayer = currentTeam.players.find(
        (player) => player.id === playerId
      );

      if (!currentPlayer)
        throw new PlayerAlreadyInTeam("Il Calciatore non è stato trovato");

      const redeem = computeRedeem(redeemType, currentPlayer.price);
      const inc = currentPlayer.price > 1 ? currentPlayer.price - redeem : 0;

      let query =
        action === "redeem"
          ? {
              $pull: { players: { id: playerId } },
              $inc: { redeemAmount: inc },
            }
          : { $pull: { players: { id: playerId } } };

      let result = await teams.updateOne({ _id: new ObjectId(teamId) }, query);

      await session.commitTransaction();

      return result;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
};
