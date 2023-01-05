const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const request = require('request');
const { on } = require('events');
const { Console } = require('console');
const PORT = 3020
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

//const clientId = '34e6ede8cf47496a986e85377dfb3939'
//const redirect_uri = 'http://localhost:3020/callback';


// app.get("/", function(req, res) {
//     res.sendFile(__dirname + '/views/index.ejs')
//})

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
            //console.log(body)
            ///////////////res.render('index')
            //res.sendFile(__dirname + './views/index')
        
        let searchBar = req.body.search
        console.log(searchBar)

        const url = `https://api.spotify.com/v1/search?type=track,artist,album&limit=5&q=${searchBar}`
        //`https://api.spotify.com/v1/search?q=${searchBar}&type=artist&limit=1`
     
            
        var options = {
            url: url,
            Host: 'api.spotify.com',
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
          };



        request.get(options, function(error, response, body) {

            // Below does not exactly match the tracks to the artists maybe even album

            console.log()

            let track = body.tracks.items[0].name
            let artist = body.artists.items[0].name
            let album = body.albums.items[0].name
            console.log(track)

            res.render('index', { text: track, song: artist, ball: album})

            // let tracks = track.map(tracks => {
                
            //     return tracks.name
            // })

            

            console.log()

            //////let artist = body.artists.items[0].name
            
            // let artistList = artist.map(artists => {
            //     return artists.name
            // })

            console.log()

            //let album = body.albums.items
            // let albumList = album.map(album => {
            //     return album.name
            // })

            // let trackElement = document.querySelector('.track')
            // trackElement.innerText = track

            //res.write(`<p class=track>${trackElement}</p>`)
            //res.send(track, artist, album)

            
            
        });
        // app.get('/index.html', function(req, res) {
        //     res.send(body)
        //     let header = document.querySelector('.header')
        //     console.log(res.body)
        //     console.log(tracks)
        //  })

        } else {
            res.sendFile(__dirname + '/fail.html')
        }

        
        console.log()

    });

   

})


    app.get('/', function(req, res) {
        // let header = document.querySelector('.header')
         console.log('hello')

        res.render('index', {text: 'world' || 'song'})
        
    })



app.post('/fail.html', function(req, res) {
    res.redirect('/')

})

app.listen(PORT, function() {
    console.log('server is live')
})







// Big changes switched from bodyparser to installing e.js to 'view' html this is inside the view folder which was created and app.set is rendering it this is so html can be modified and ideally i can pass spotify data to html still working on how to grab specific elements but i think i just figured it out add <% %> whatever in html file to pass the variables view web dev siplified for details













// inside request.post - const url = `https://api.spotify.com/v1/search?q=${searchBar}&type=track%2Cartist&limit=5`




//  below this was in request.get the code that i thougt needed to be in 


            //console.log(body.tracks.items[0].name)
            


            //response.on('data', function(data) {
                //console.log(JSON.parse(data))
                // console.log(dataReceived)
                // if(dataReceived) {
                //     console.log(dataReceived)
                // } else {
                //     console.log('Error')
                // }
            
            //})




// LEFT OFF UP ABOVE FIGURED OUT GETTING ACCESS TOKEN FOR EVERY SEARCH MADE USING TOKEN TO ACCESS SPOTIFY API AND TO SEARCH SPOTFIFY 

// RESTRUCTURED HTML FILES/NAMES TO GO DIRECTLY TO SEARCH PAGE CHANGED EXPRESS ROUTES BEFORE STARTING SAVE COMMIT TO GIT

// NOW ITS TIME TO FIGURE OUT SPECIFICALLY WHAT INFO TO EXTRACT FROM THE API RESPONSE AND POST IT IN MY WEB APP





/*
const options = {
    headerContent: 'application/json',
    Host: 'api.spotify.com',
        headers: {
            'Authorization' : 'bearer ' + token  
        }
}
*/


//app.post("/search.html", function(req, res) {

       

        /*
        The url i camme up with
        `https://api.spotify.com/v1/search?q=${searchBar}?type=artist,album,track&limit=5`

        copied url
        `http://api.spotify.com/v1/search?q=${searchBar}&type=track%2Cartist&limit=5
        */

       

            /*
            GET /v1/search?type=album&include_external=audio HTTP/1.1
            Content-Type: application/json
            Authorization: 
            Host: api.spotify.com
            */


//         https.get(url, options, function(response) {
//             response.on('data', function(data) {

//                 console.log(JSON.parse(data))
//                 // console.log(dataReceived)
//                 // if(dataReceived) {
//                 //     console.log(dataReceived)
//                 // } else {
//                 //     console.log('Error')
//                 // }
//             })
//         })
// })