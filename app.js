const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const PORT = 3020
const app = express()

app.get('/', function(req, res) {
    res.send('TESTING TESTING')
})

















app.listen(PORT, function() {
    console.log('server is live')
})
