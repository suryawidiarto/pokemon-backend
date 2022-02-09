const express = require("express");
const {
  getListPokemon,
  getDetailPokemon,
  getMyListPokemon,
  catchPokemon,
  releasePokemon,
  renamePokemon,
} = require("../controllers/pokemonController");

const pokemonRouter = express.Router();

pokemonRouter.get("/list-pokemon", getListPokemon);
pokemonRouter.get("/detail-pokemon/:IdPokemon", getDetailPokemon);
pokemonRouter.get("/my-list-pokemon", getMyListPokemon);
pokemonRouter.post("/catch-pokemon/:IdPokemon", catchPokemon);
pokemonRouter.post("/release-pokemon/:IdPokemon", releasePokemon);
pokemonRouter.post("/rename-pokemon/:IdPokemon", renamePokemon);

module.exports = pokemonRouter;
