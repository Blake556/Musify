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

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})




app.post('/', function(req, res) {


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
        console.log(token)
        res.sendFile(__dirname + '/search.html')
    } else {
        res.sendFile(__dirname + '/fail.html')
    }

    });
})


app.post('/fail.html', function(req, res) {
    res.redirect('/')

})


   
app.post("/search.html", function(req, res) {

        let searchBar = req.body.search
        console.log(searchBar)

        /*
        The url i camme up with
        `https://api.spotify.com/v1/search?q=${searchBar}?type=artist,album,track&limit=5`

        copied url
        `http://api.spotify.com/v1/search?q=${searchBar}&type=track%2Cartist&limit=5
        */

        let accessToken = 'BQDeCGs6YKaC35Zp5eXs7MothnUEOu2QAV5-LfZUamWxzT9p_NIypG4dzZkA_lCXNqoeEL6dh89nJ3NIojNcdvUp9hDMxoMnshqtTkerBmj215sPgcY'

        const url = `https://api.spotify.com/v1/search?q=${searchBar}&type=track%2Cartist&limit=5`

        
            const options = {
                headerContent: 'application/json',
                Host: 'api.spotify.com',
                    headers: {
                        Authorization: 'bearer ' + accessToken  
                    }
            }


            /*
            GET /v1/search?type=album&include_external=audio HTTP/1.1
            Content-Type: application/json
            Authorization: 
            Host: api.spotify.com
            */


        https.get(url, options, function(response) {
            response.on('data', function(data) {

                console.log(JSON.parse(data))
                // console.log(dataReceived)
                // if(dataReceived) {
                //     console.log(dataReceived)
                // } else {
                //     console.log('Error')
                // }
            })
        })



})




app.listen(PORT, function() {
    console.log('server is live')
})
