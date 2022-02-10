const UserPokemonModel = require("../models/pokemonModel");
const { redisCache } = require("../utils/redisCache");
const axios = require("axios").default;

exports.getListPokemon = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const offset = currentPage > 1 ? (currentPage - 1) * 40 : 0;
    const limit = req.query.limit || 40;

    const data = await redisCache(`allPokemon:${currentPage}`, 3600, async () => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      return response.data;
    });

    const totalPage = Math.floor(data.count / limit);
    const totalData = data.count;
    const allPokemon = data.results;

    res.status(201).json({ currentPage, totalPage, totalData, allPokemon });
  } catch (err) {
    console.log(err);
  }
};

exports.getDetailPokemon = async (req, res) => {
  try {
    const id = req.params.IdPokemon;
    const pokemon = await redisCache(`pokemon:${id}`, 3600, async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.data;
    });

    res.status(201).json({
      id: pokemon.id,
      name: pokemon.name,
      abilities: pokemon.abilities,
      stats: pokemon.stats,
      moves: pokemon.moves,
      types: pokemon.types,
      images: pokemon.sprites,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.catchPokemon = (req, res) => {
  const probability = Math.random();
  if (probability > 0.5) {
    res.json({ catch: "success", probability: probability });
  } else {
    res.json({ catch: "failed", probability: probability });
  }
};

exports.addMyListPokemon = async (req, res) => {
  const id = req.body.id_pokemon;
  const detailPokemon = await redisCache(`pokemon:${id}`, 3600, async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
  });

  const userPokemon = new UserPokemonModel({
    pokemon: {
      id_pokemon: detailPokemon.id,
      name: req.body.name || detailPokemon.name,
      abilities: detailPokemon.abilities,
      stats: detailPokemon.stats,
      moves: detailPokemon.moves,
      types: detailPokemon.types,
      images: detailPokemon.sprites,
    },
  });

  const response = await userPokemon.save();
  res.status(201).send(response);
};

exports.getMyListPokemon = async (req, res) => {
  const totalMyPokemon = await UserPokemonModel.find().countDocuments();
  const myPokemon = await UserPokemonModel.find();
  res.status(201).json({ totalPokemon: totalMyPokemon, listPokemon: myPokemon });
};

exports.renamePokemon = (req, res) => {
  res.send("POST RENAME POKEMON");
};

exports.releasePokemon = (req, res) => {
  res.send("POST RELEASE POKEMON");
};
