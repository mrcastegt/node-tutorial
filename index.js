var express = require('express');

var mimodulo = require('./routes/mimodulo');

var app = express();

app.get('/', function (req, res) {
  res.send('Hola mundo!');
});

app.use('/mimodulo', mimodulo);

var server = app.listen(3000);
