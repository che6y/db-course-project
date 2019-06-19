const express        = require('express');
const router         = express.Router();
const connection     = require('../database.js');
const cookieParser   = require('cookie-parser');
const csrf           = require('csurf');
const methodOverride = require('method-override');
const { check, validationResult } = require('express-validator/check');

router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));
router.use(methodOverride('_method'));
router.use(csrf({ cookie: true }));

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


// Type of check
router.get('/type-of-check', function(req, res, next) {
    
    connection.query('SELECT * FROM `types_of_check` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'type-of-check', { title: 'Вид проверки', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/type-of-check', function(req, res, next) {
    connection.query(
        'INSERT INTO `types_of_check`(`name`) VALUES (?)',
        [req.body.name],
        function (error, results, fields) { if (error) throw error; }
    );
    res.redirect('/type-of-check');
}).put('/type-of-check', function(req, res, next) {
    connection.query(
        'UPDATE `types_of_check` SET `name`=? WHERE `id`=?',
        [req.body.name, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/type-of-check');
    
}).delete('/type-of-check', function(req, res, next) {
    connection.query(
        'DELETE FROM `types_of_check` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/type-of-check/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM `types_of_check` WHERE `id`=?', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'type-of-check-item', { title: results[0].name + ' - Изменить', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Customers
router.get('/customers', function(req, res, next) {
    
    connection.query('SELECT * FROM `customers` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'customers', { title: 'Заказчики', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/customers', function(req, res, next) {
    connection.query(
        'INSERT INTO `customers`(`name`,`address`) VALUES (?,?)',
        [req.body.name, req.body.address],
        function (error, results, fields) { if (error) throw error; }
    );
    res.redirect('/customers');
}).put('/customers', function(req, res, next) {
    connection.query(
        'UPDATE `customers` SET `name`=?, `address`=? WHERE `id`=?',
        [req.body.name, req.body.address, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/customers');
    
}).delete('/customers', function(req, res, next) {
    connection.query(
        'DELETE FROM `customers` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/customers/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM `customers` WHERE `id`=?', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'customer-edit', { title: results[0].name + ' - Изменить', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Staff
router.get('/staff', function(req, res, next) {
    connection.query('SELECT * FROM `staff` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'staff', { title: 'Специалисты', data: results, csrfToken: req.csrfToken() } );
    });

}).post('/staff', function(req, res, next) {
    connection.query(
        'INSERT INTO `staff`(`name`, `surname`, `fathers_name`) VALUES (?,?,?)',
        [req.body.name.trim(), req.body.surname.trim(), req.body.fathersName.trim()],
        function (error, results, fields) { if (error) throw error; }
    );

    res.redirect('/staff');

}).put('/staff', function(req, res, next) {
    connection.query(
        'UPDATE `staff` SET `name`=?, `surname`=?, `fathers_name`=? WHERE `id`=?',
        [req.body.name.trim(), req.body.surname.trim(), req.body.fathersName.trim(), req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );

    res.redirect('/staff');

}).delete('/staff', function(req, res, next) {
    connection.query(
        'DELETE FROM `staff` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );

    res.redirect('back');
});
router.get('/staff/:id', function(req, res, next) {

    connection.query('SELECT * FROM `staff` WHERE `id`=?', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'staff-edit', { title: 'Сотрудник', data: results[0], csrfToken: req.csrfToken() } );
    });

});


module.exports = router;