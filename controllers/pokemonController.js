const UserPokemonModel = require("../models/pokemonModel");
const axios = require("axios").default;
const redis = require("redis");

const redisClient = redis.createClient({
  url: `${process.env.REDIS_URI}`,
});

try {
  (async () => {
    await redisClient.connect();
  })();
} catch (err) {
  console.log(err);
}

const redisCache = async (key, timeExpired, apiCallback) => {
  try {
    const getData = await redisClient.get(key);
    if (getData != null) {
      //getting data from cache
      return JSON.parse(getData);
    } else {
      //getting new data from api
      const newData = await apiCallback();
      await redisClient.setEx(key, timeExpired, JSON.stringify(newData));
      return newData;
    }
  } catch (err) {
    throw Error(err);
  }
};

exports.getListPokemon = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const offset = currentPage > 1 ? (currentPage - 1) * 40 : 0;
    const limit = req.query.limit || 40;

    const data = await redisCache(`allPokemon:${currentPage}`, 7200, async () => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      return response.data;
    });

    const totalPage = Math.ceil(data.count / limit);
    const totalData = data.count;
    const allPokemon = data.results;

    res.status(201).json({ currentPage, totalPage, limitPage: limit, totalData, allPokemon });
  } catch (err) {
    console.log(err);
  }
};

exports.getDetailPokemon = async (req, res) => {
  try {
    const id = req.params.IdPokemon;
    const pokemon = await redisCache(`pokemon:${id}`, 7200, async () => {
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

exports.catchPokemon = async (req, res) => {
  try {
    const id = req.params.IdPokemon;
    const pokemon = await redisCache(`pokemon:${id}`, 7200, async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.data;
    });

    const probability = Math.random();
    if (probability > 0.5) {
      res.json({ catch: "success", probability: probability, pokemonName: pokemon.name });
    } else {
      res.json({ catch: "failed", probability: probability, pokemonName: pokemon.name });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addMyListPokemon = async (req, res) => {
  try {
    const id = req.body.id_pokemon;
    const detailPokemon = await redisCache(`pokemon:${id}`, 7200, async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.data;
    });

    const userPokemon = new UserPokemonModel({
      pokemon: {
        id_pokemon: detailPokemon.id,
        default_name: req.body.name,
        name: req.body.name,
        abilities: detailPokemon.abilities,
        stats: detailPokemon.stats,
        moves: detailPokemon.moves,
        types: detailPokemon.types,
        images: detailPokemon.sprites,
      },
    });

    const response = await userPokemon.save();
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
  }
};

exports.getMyListPokemon = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const totalMyPokemon = await UserPokemonModel.find().countDocuments();
    const limit = req.query.limit || 10;
    const offset = (currentPage - 1) * limit;
    const totalPage = Math.ceil(totalMyPokemon / limit);
    const allMyPokemon = await UserPokemonModel.find().skip(offset).limit(limit);
    res
      .status(201)
      .json({ totalPokemon: totalMyPokemon, totalPage: totalPage, listPokemon: allMyPokemon });
  } catch (err) {
    console.log(err);
  }
};

exports.getDetailMyPokemon = async (req, res) => {
  try {
    const id = req.params.IdPokemon;
    const detailPokemon = await UserPokemonModel.findById(id);
    res.status(201).send(detailPokemon);
  } catch (err) {
    console.log(err);
  }
};

exports.renamePokemon = async (req, res) => {
  try {
    const id = req.body.id;
    const dataPokemon = await UserPokemonModel.findById(id);
    let current = dataPokemon.pokemon.rename_count_current;
    let next = dataPokemon.pokemon.rename_count_next;

    let defaultName = dataPokemon.pokemon.default_name;
    let rename = defaultName.concat(`-${current}`);
    const nextFibo = current + next;

    dataPokemon.pokemon.name = rename;
    dataPokemon.pokemon.rename_count_current = next;
    dataPokemon.pokemon.rename_count_next = nextFibo;

    const pokemon = await dataPokemon.save();
    res.status(201).send(pokemon);
  } catch (err) {
    console.log(err);
  }
};

exports.releasePokemon = async (req, res) => {
  try {
    //get random number from 2-10
    const randNumber = Math.floor(Math.random() * (10 - 2 + 1) + 2);

    //check number is prime
    for (let i = 2; i < randNumber; i++) {
      if (randNumber % i == 0) {
        return res
          .status(201)
          .json({ release: "release pokemon failed", isPrime: "false", randNumber: randNumber });
      }
    }

    await UserPokemonModel.deleteOne({ _id: req.body._id });
    res
      .status(201)
      .json({ release: "release pokemon success", isPrime: "true", randNumber: randNumber });
  } catch (err) {
    console.log(err);
  }
};
