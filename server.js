const express = require("express");
const cors = require("cors");
const pokemonRouter = require("./routes/pokemonRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/poke-api", pokemonRouter);

app.listen(8080, () => {
  console.log("Server Running Succesfully");
});
