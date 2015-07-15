var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('Este es mi modulo.');
});

module.exports = router;
