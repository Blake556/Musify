// Node Packages
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 3020;
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Routes
app.get('/', function(req, res) {
    // Display the search form with default data
    res.render('index', { data: {} });
});

app.post("/", function(req, res) {
    var client_id = '34e6ede8cf47496a986e85377dfb3939';
    var client_secret = 'da1b1df8a34f41e1a19aff6d2772e3f6';

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token?',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var token = body.access_token;

            let searchBar = req.body.search;

            const url = `https://api.spotify.com/v1/search?type=track,artist,album&limit=15&q=${searchBar}`;

            var options = {
                url: url,
                Host: 'api.spotify.com',
                headers: { 'Authorization': 'Bearer ' + token },
                json: true
            };

            request.get(options, function(error, response, body) {
                const data = {
                    songsListed: [],
                    artistsListed: [],
                    albumsListed: []
                };

                if (!error && response.statusCode === 200) {
                    const tracks = body.tracks.items || [];
                    const artists = body.artists.items || [];
                    const albums = body.albums.items || [];

                    for (let i = 0; i < tracks.length; i++) {
                        data.songsListed.push(tracks[i].name || 'song');
                        data.artistsListed.push(artists[i].name || 'artist');
                        data.albumsListed.push(albums[i].name || 'album');
                    }
                }

                res.render('index', { data: data });
            });
        } else {
            // Error with Spotify API request, render the search form with default data
            res.render('index', { data: {} });
        }
    });
});

app.listen(PORT, function() {
    console.log('server is live');
});
