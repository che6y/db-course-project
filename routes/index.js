var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Laboratory' });
});
router.get('/registry', function(req, res, next) {
    res.render('registry', { title: 'Прием проб' });
});
router.get('/bacteriology-lab', function(req, res, next) {
    res.render( 'bacteriology' );
});

module.exports = router;
