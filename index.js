const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

const words = require('./words');

server = http.createServer(app);

app.use(cors());

app.get('/autocomplete', function(req, res) {
    const query = req.query.term;

    res.json(words.filter(s => s.indexOf(query) !== -1));
});

server.listen(3000);