var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', function(req, res) {  
  res.render('index.html');
});

module.exports = router;

//https://expressjs.com/pt-br/guide/routing.html