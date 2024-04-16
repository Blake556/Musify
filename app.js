// Node Packages

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const { on } = require("events");
const { Console } = require("console");
const favicon = require("serve-favicon");
const PORT = process.env.PORT || 3020;
const app = express();
require('dotenv').config()

// Middleware

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/images/favicon.ico"));

// Routes

app.get("/", function (req, res) {
  //Added { data: {} } below. so if data is not defined due to search not made yet. Allows a default Msg in ejs
  res.render("index", { data: {} });
});

app.post("/", function (req, res) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token?",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;

      let searchBar = req.body.search;

      const url = `https://api.spotify.com/v1/search?type=track,artist,album&limit=15&q=${searchBar}`;

      var options = {
        url: url,
        Host: "api.spotify.com",
        headers: { Authorization: "Bearer " + token },
        json: true,
      };

      request.get(options, function (error, response, body) {
        const tracks = body.tracks.items || [];
        const artists = body.artists.items || [];
        const albums = body.albums.items || [];

        const data = {
          songsListed: [],
          artistsListed: [],
          albumsListed: [],
        };

        for (let i = 0; i < tracks.length; i++) {
          data.songsListed.push(tracks[i].name);
          data.artistsListed.push(artists[i].name);
          data.albumsListed.push(albums[i].name);
        }

        console.log(data);

        res.render("index", { data: data });
      });
    } else {
      res.sendFile(__dirname + "/public/html/fail.html");
    }
  });
});

app.post("/fail.html", function (req, res) {
  res.redirect("/");
});

app.listen(PORT, function () {
  console.log("server is live");
});
