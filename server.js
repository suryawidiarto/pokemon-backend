require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pokemonRouter = require("./routes/pokemonRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/poke-api", pokemonRouter);

mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server Connection Success || Running Successfully");
    });
  })
  .catch((err) => console.log(err));
