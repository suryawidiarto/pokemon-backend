exports.getListPokemon = (req, res) => {
  res.send("GET LIST POKEMON");
};

exports.getDetailPokemon = (req, res) => {
  res.send("GET DETAIL POKEMON");
};

exports.getMyListPokemon = (req, res) => {
  res.send("GET MY LIST POKEMON");
};

exports.renamePokemon = (req, res) => {
  res.send("POST RENAME POKEMON");
};

exports.catchPokemon = (req, res) => {
  res.send("POST CATCH POKEMON");
};

exports.releasePokemon = (req, res) => {
  res.send("POST RELEASE POKEMON");
};
