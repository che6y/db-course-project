var express = require('express');
var router = express.Router();
var connection = require('../database.js');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Лаборатория' });
});
router.get('/registry', function(req, res, next) {
    connection.query('SELECT * FROM `registry_reports` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render('registry', { title: 'Прием проб', data: results });
    });
});

router.get('/bacteriology', function(req, res, next) {
    res.render( 'bacteriology', { title: 'Бактериологическая лаборатория' } );
});

router.get('/chemistry', function(req, res, next) {
    res.render( 'chemistry', { title: 'Химическая лаборатория' } );
});

router.get('/staff', function(req, res, next) {
    res.render( 'staff', { title: 'Специалисты' } );
});

router.get('/type-of-check', function(req, res, next) {
    
    connection.query('SELECT * FROM `types_of_check` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'type-of-check', { title: 'Вид проверки', data: results } );
    });
    
});

router.get('/type-of-check/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM `types_of_check` WHERE `id`=?', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'type-of-check-item', { title: results[0].name + ' - Изменить', data: results[0] } );
    });
    
});

router.post('/type-of-check', function(req, res, next) {
    connection.query(
        'UPDATE `types_of_check` SET `name`=? WHERE `id`=?',
        [req.body.name, req.body.id],
        function (error, results, fields) {
            if (error) throw error;
            console.log(results);
        }
    );
    
    connection.query('SELECT * FROM `types_of_check` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'type-of-check', { title: 'Вид проверки', data: results } );
    });
    
});

module.exports = router;