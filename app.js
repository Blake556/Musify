const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const request = require('request');
const { on } = require('events')
const PORT = 3020
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

//const clientId = '34e6ede8cf47496a986e85377dfb3939'
//const redirect_uri = 'http://localhost:3020/callback';

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html')
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
            res.sendFile(__dirname + '/index.html')
        } else {
            res.sendFile(__dirname + '/fail.html')
        }




        let searchBar = 'pink floyd' //req.body.search
        //console.log(searchBar)

        
        const url = `https://api.spotify.com/v1/search?type=track&limit=5&q=${searchBar}`
        //`https://api.spotify.com/v1/search?q=${searchBar}&type=artist&limit=1`
     
            
        var options = {
            url: url,
            Host: 'api.spotify.com',
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
          };



        request.get(options, function(error, response, body) {

            let track = body.tracks.items
            track.map(tracks => {
                console.log(tracks.name)
            })

            console.log(body.tracks.items[0].name)   //body.artists.items

           


            //response.on('data', function(data) {
                //console.log(JSON.parse(data))
                // console.log(dataReceived)
                // if(dataReceived) {
                //     console.log(dataReceived)
                // } else {
                //     console.log('Error')
                // }
            
            //})
        });
    });

})


app.post('/fail.html', function(req, res) {
    res.redirect('/')

})



app.listen(PORT, function() {
    console.log('server is live')
})




// inside request.post - const url = `https://api.spotify.com/v1/search?q=${searchBar}&type=track%2Cartist&limit=5`

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