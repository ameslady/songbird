const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;
const axios = require("axios");
const { getToken, getPlaylist } = require("./helpers/spotify");
require("dotenv").config();

// socket IO
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

// express configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// spotify authentication token
let token = "";
getToken().then((res) => (token = res.data.access_token));

app.get("/api/data", (req, res) => {
  getPlaylist(token).then((result) =>
    res.json({ src: result.data.tracks[0].preview_url })
  );
});

server.listen(PORT, () => {
  console.log(
    `Express seems to be listening on port ${PORT} so that's pretty good 👍`
  );
});

let users = [];

// socket listeners
io.on("connection", (socket) => {
  console.log("User has connected ", socket.handshake.query.username);
  users.push(socket.handshake.query.username);
  console.log("users: ", users);
});
