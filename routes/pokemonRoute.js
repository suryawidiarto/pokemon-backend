const express = require("express");
const {
  getListPokemon,
  getDetailPokemon,
  getMyListPokemon,
  catchPokemon,
  releasePokemon,
  renamePokemon,
  addMyListPokemon,
  getDetailMyPokemon,
} = require("../controllers/pokemonController");

const pokemonRouter = express.Router();

pokemonRouter.get("/list-pokemon", getListPokemon);
pokemonRouter.get("/detail-pokemon/:IdPokemon", getDetailPokemon);
pokemonRouter.get("/my-list-pokemon", getMyListPokemon);
pokemonRouter.get("/detail-my-pokemon/:IdPokemon", getDetailMyPokemon);
pokemonRouter.post("/add-my-list-pokemon", addMyListPokemon);
pokemonRouter.post("/catch-pokemon/:IdPokemon", catchPokemon);
pokemonRouter.post("/release-pokemon", releasePokemon);
pokemonRouter.post("/rename-pokemon", renamePokemon);

module.exports = pokemonRouter;
