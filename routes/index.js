var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Laboratory' });
});
router.get('/registry', function(req, res, next) {
    connection.query('SELECT * FROM `registry`', function (err, rows, fields) {
        if (err) throw err;

        res.render('registry', { title: 'Прием проб', data: rows });
    });
});
router.get('/bacteriology', function(req, res, next) {
    res.render( 'bacteriology' );
});
router.get('/chemistry', function(req, res, next) {
    res.render( 'chemistry' );
});
router.get('/staff', function(req, res, next) {
    res.render( 'staff' );
});

module.exports = router;
