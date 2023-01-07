// Node Packages

const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const request = require('request');
const { on } = require('events');
const { Console } = require('console');
const favicon = require('serve-favicon');
const PORT = 3020
const app = express()


// Middleware

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/images/favicon.ico'));



// Routes

app.get('/', function(req, res) {
    res.render('index')
})


app.post("/", function(req, res) {

    var client_id = '34e6ede8cf47496a986e85377dfb3939';
    var client_secret = 'da1b1df8a34f41e1a19aff6d2772e3f6';

    var authOptions = {
    url: 'https://accounts.spotify.com/api/token?',
    headers: {
        'Authorization': 'Basic ' + (new   Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
    };


    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var token = body.access_token;
           
        let searchBar = req.body.search
        
        const url = `https://api.spotify.com/v1/search?type=track,artist,album&limit=5&q=${searchBar}`
          
        var options = {
            url: url,
            Host: 'api.spotify.com',
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
          };

        request.get(options, function(error, response, body) {

            // Below does not exactly match the tracks to the artists maybe even album

            res.render('index', 
                {   
                    song1: body.tracks.items[0].name,
                    song2: body.tracks.items[1].name,
                    song3: body.tracks.items[2].name,
                    song4: body.tracks.items[3].name,
                    song5: body.tracks.items[4].name, 
                    
                    artist1: body.artists.items[0].name,
                    artist2: body.artists.items[1].name,
                    artist3: body.artists.items[2].name,
                    artist4: body.artists.items[3].name,
                    artist5: body.artists.items[4].name,

                    album1: body.albums.items[0].name,
                    album2: body.albums.items[1].name,
                    album3: body.albums.items[2].name,
                    album4: body.albums.items[3].name,
                    album5: body.albums.items[4].name,
            })

        });

        } else {
            res.sendFile(__dirname + '/public/html/fail.html')
        }

    });
})


app.post('/fail.html', function(req, res) {
    res.redirect('/')

})

app.listen(PORT, function() {
    console.log('server is live')
})
