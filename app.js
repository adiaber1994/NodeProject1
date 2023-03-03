const express = require("express");
const server = express();
const usersRouts = require("./routs/usersRouts.js");
const authRouts = require("./routs/authRouts.js");
const cardsRouts = require("./routs/cardsRouts");
const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost/dataProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'
));


server.use(express.json());     
server.use("/api/auth", authRouts);
server.use("/api/users", usersRouts);
server.use("/api/cards", cardsRouts);
server.listen(5000,() => console.log("server started"));


