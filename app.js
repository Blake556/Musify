// Node Packages

const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const request = require('request');
const { on } = require('events');
const { Console } = require('console');
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 3020
const app = express()


// Middleware

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/images/favicon.ico'));



// Routes

app.get('/', function(req, res) {

    //Added { data: {} } below. so if data is not defined due to search not made yet. Allows a default Msg in ejs
    res.render('index',  { data: {} })
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
        
        const url = `https://api.spotify.com/v1/search?type=track,artist,album&limit=15&q=${searchBar}`
          
        var options = {
            url: url,
            Host: 'api.spotify.com',
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
          };

        request.get(options, function(error, response, body) {

            // Below does not exactly match the tracks to the artists maybe even album

            // const songsListed = []
            // const albumListed = []
            // const artistListed = []

            // for(let i = 0; i < body.length; i++) {
            //     songsListed.push(body.tracks.items[i].name)
            //     albumListed.push(body[i].artists.items.name)
            //     artistListed.push(body[i].album.items.name)
            // }

            // console.log(songsListed.length, albumListed, artistListed)


            const tracks = body.tracks.items || []
            const artists = body.artists.items || []
            const albums = body.albums.items || []

            const data = {
                songsListed: [],
                artistsListed: [],
                albumsListed: []
            }

            for(let i = 0; i < tracks.length; i++) {
                data.songsListed.push(tracks[i].name)
                data.artistsListed.push(artists[i].name)
                data.albumsListed.push(albums[i].name)
            }


            console.log(data)

            res.render('index', { data: data }
            //     {   
            //         song1: body.tracks.items[0].name,
            //         song2: body.tracks.items[1].name,
            //         song3: body.tracks.items[2].name,
            //         song4: body.tracks.items[3].name,
            //         song5: body.tracks.items[4].name,
            //         song6: body.tracks.items[5].name,
            //         song7: body.tracks.items[6].name,
            //         song8: body.tracks.items[7].name,
            //         song9: body.tracks.items[8].name,
            //         song10: body.tracks.items[9].name,  
                    
            //         artist1: body.artists.items[0].name,
            //         artist2: body.artists.items[0].name,
            //         artist3: body.artists.items[0].name,
            //         artist4: body.artists.items[0].name,
            //         artist5: body.artists.items[0].name,
            //         artist6: body.artists.items[0].name,
            //         artist7: body.artists.items[0].name,
            //         artist8: body.artists.items[0].name,
            //         artist9: body.artists.items[0].name,
            //         artist10: body.artists.items[0].name,

            //         album1: body.albums.items[0].name,
            //         album2: body.albums.items[1].name,
            //         album3: body.albums.items[2].name,
            //         album4: body.albums.items[3].name,
            //         album5: body.albums.items[4].name,
            //         album6: body.albums.items[5].name,
            //         album7: body.albums.items[6].name,
            //         album8: body.albums.items[7].name,
            //         album9: body.albums.items[8].name,
            //         album10: body.albums.items[9].name
            // }
            )
            

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



   // practice grabbing data from spotify
            
    // let track = body.tracks.items
    // for(let i = 0; i < track.length; i++) {
    //     console.log(track[i].name)
    // } 
             
         