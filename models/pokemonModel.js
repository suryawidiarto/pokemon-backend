const mongoose = require("mongoose");

const userPokemonSchema = new mongoose.Schema(
  {
    pokemon: {
      id_pokemon: { type: Number, required: true },
      default_name: { type: String, required: true },
      name: { type: String, required: true },
      rename_count_current: { type: Number, default: 0 },
      rename_count_next: { type: Number, default: 1 },
      abilities: { type: Array, required: true },
      stats: { type: Array, required: true },
      moves: { type: Array, required: true },
      types: { type: Array, required: true },
      images: { type: Object, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const UserPokemonModel = mongoose.model("UserPokemon", userPokemonSchema);

module.exports = UserPokemonModel;
