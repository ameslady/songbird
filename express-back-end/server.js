const express = require("express");
const app = express();
// const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

// helper functions
const {
  getToken,
  getPlaylist,
  filterTitles,
  createAutocomplete,
  queryArtist,
} = require("./helpers/spotify");
const getTrack = require("./helpers/game");
const sampleSonglist = require("./helpers/autocompleteSongs");

// socket IO
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

// global variables
let token = "";
let users = [];
let rooms = [];

// express configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// retrieves authentication token from spotify
getToken().then((res) => {
  token = res.data.access_token;
});

server.listen(PORT, () => {
  console.log(`Express is listening on port ${PORT} 👍`);
});

// establishes socket connection
io.on("connection", (socket) => {
  const { username, roomId, avatar } = socket.handshake.query;
  console.log("User has connected:", username);
  socket.join(roomId);

  const host = rooms.find(({ Id }) => Id === roomId) ? false : true;
  console.log("Host?: ", host);
  users.push({
    id: socket.id,
    username,
    roomId,
    avatar,
    score: 0,
    roundScore: 0,
    host,
    winning: false,
  });

  if ((index = rooms.findIndex(({ Id }) => Id === roomId)) === -1) {
    rooms.push({
      Id: roomId,
      tracks: [],
      titles: [],
      currentTrack: {},
      rounds: 0,
      currentRound: 1,
    });
  }

  const usersInRoom = users.filter((u) => u.roomId === roomId);
  io.in(roomId).emit("update-users", usersInRoom);

  // socket.on("player-joined", () => {
  //   console.log("player-joined ", roomId);
  // });

  socket.on("end-of-round", () => {
    const userIndex = users.findIndex(({ id }) => id === socket.id);

    if (!users[userIndex].host) return;

    const index = rooms.findIndex(({ Id }) => Id === roomId);
    rooms[index].currentRound++;
    const nextTrack = getTrack(rooms, roomId);

    if (rooms[index].currentRound === rooms[index].rounds + 1) {
      return setTimeout(() => {
        io.in(roomId).emit("end-of-game", "End of Game");
      }, 10000);
    }

    setTimeout(() => {
      users.forEach((user) => {
        if ((user.roomID = roomId)) user.roundScore = 0;
      });
      io.in(roomId).emit("next-round", nextTrack);
    }, 10000);

    setTimeout(() => {
      // After the 5 second countdown, Tell clients to play track and start guessing
      io.to(roomId).emit("round-start", rooms[index].currentRound);
    }, 15000);
  });

  socket.on("correct-answer", (score) => {
    const userIndex = users.findIndex(({ id }) => id === socket.id);
    const newScore = users[userIndex].score + score;
    users[userIndex] = {
      ...users[userIndex],
      roundScore: score,
      score: newScore,
    };

    users.sort((a, b) => b.score - a.score);
    users[0].winning = true;
    if (users.length > 1) {
      for (let i = 1; i < users.length; i++) {
        users[i].winning = false;
      }
    }

    io.in(users[userIndex].roomId).emit(
      "update-users",
      users.filter((u) => u.roomId === users[userIndex].roomId)
    );
    io.in(users[userIndex].roomId).emit("receive-chat-messages", {
      username,
      message: `Correct guess! Scored: ${score}`,
      avatar,
    });
  });

  socket.on("send-chat-message", (guess) => {
    io.in(roomId).emit("receive-chat-messages", {
      username,
      message: guess,
      avatar,
    });
  });

  socket.on("new-game", () => {
    const roomIndex = rooms.findIndex(({ Id }) => Id === roomId);

    rooms[roomIndex].currentRound = 1;
    users.forEach((u) => {
      if (u.roomId === roomId) {
        u.score = 0;
        u.roundScore = 0;
      }
    });
    io.in(roomId).emit(
      "update-users",
      users.filter((u) => u.roomId === roomId)
    );
    io.in(roomId).emit("start-new-game", "new-game");
  });

  // what dis doing?
  socket.on("start-game", (genre, rounds, artist) => {
    // Obtain the playlist based on the selected genre passed in from host.
    getPlaylist(token, genre, artist).then((result) => {
      const tracks = result.data.tracks.filter((t) => t.preview_url !== null);
      const titles = filterTitles(tracks);

      const index = rooms.findIndex(({ Id }) => Id === roomId);
      rooms[index] = { ...rooms[index], tracks, titles, rounds };
      const nextTrack = getTrack(rooms, roomId);

      // Create an list of red-herring songs.
      const autocomplete = createAutocomplete(sampleSonglist, titles);

      io.to(roomId).emit("next-track", nextTrack);
      io.to(roomId).emit("track-list", autocomplete);
      // Tell all players that the game has started
      io.to(roomId).emit("game-started", rooms[index].roomId);
      setTimeout(() => {
        // After the 5 second countdown, Tell clients to play track and start guessing.
        io.to(roomId).emit("round-start", rooms[index].currentRound);
      }, 5000);
    });
  });

  socket.on("search-artist", (searchParam) => {
    queryArtist(token, searchParam).then((result) => {
      io.to(roomId).emit(
        "artist-list",
        result.data.artists.items.map((artist) => {
          return { artist: artist.name, id: artist.id };
        })
      );
    });
  });

  // disconnects user and removes them from users array
  socket.on("disconnect", () => {
    disUser = users.find((u) => u.id === socket.id);
    users = users.filter((u) => u.id !== socket.id);

    if (disUser.host) {
      newHostIndex = users.findIndex((u) => u.roomId === disUser.roomId);
      if (newHostIndex !== -1) {
        users[newHostIndex].host = true;
      }
    }
    io.in(roomId).emit(
      "update-users",
      users.filter((u) => u.roomId === roomId)
    );
  });
});
