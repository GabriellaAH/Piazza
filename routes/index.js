var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.send('hello this is the Homepage')
});

module.exports = router;