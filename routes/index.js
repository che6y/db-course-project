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

// Laboratories
router.get('/laboratories', function(req, res, next) {
    connection.query('SELECT * FROM `laboratories` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'laboratories', { title: 'Отделы', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/laboratories', function(req, res, next) {
    connection.query(
        'INSERT INTO `laboratories`(`name`) VALUES (?)',
        [req.body.name.trim()],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/laboratories');
    
}).put('/laboratories', function(req, res, next) {
    connection.query(
        'UPDATE `laboratories` SET `name`=? WHERE `id`=?',
        [req.body.name.trim(), req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/laboratories');
    
}).delete('/laboratories', function(req, res, next) {
    connection.query(
        'DELETE FROM `laboratories` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/laboratory/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM `laboratories` WHERE `id`=?', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'laboratory-edit', { title: 'Отделы', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Laboratories
router.get('/positions', function(req, res, next) {
    connection.query('SELECT * FROM `positions` LIMIT 10', function (error, results, fields) {
        if (error) throw error;
        res.render( 'positions', { title: 'Список должностей', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/positions', function(req, res, next) {
    connection.query(
        'INSERT INTO `positions`(`name`) VALUES (?)',
        [req.body.name.trim()],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/positions');
    
}).put('/positions', function(req, res, next) {
    connection.query(
        'UPDATE `positions` SET `name`=? WHERE `id`=?',
        [req.body.name.trim(), req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/positions');
    
}).delete('/positions', function(req, res, next) {
    connection.query(
        'DELETE FROM `positions` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/position/:id', function(req, res, next) {
    connection.query('SELECT * FROM `positions` WHERE `id`=?', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'position-edit', { title: 'Должность', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Tests
router.get('/tests', function(req, res, next) {
    connection.query('SELECT tests.id, tests.name, laboratories.name AS lab_name FROM tests LEFT JOIN laboratories ON tests.lab_id = laboratories.id LIMIT 10; SELECT * FROM laboratories LIMIT 10;', function (error, results, fields) {
        if (error) throw error;
        res.render( 'tests', { title: 'Список проверок', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/tests', function(req, res, next) {
    connection.query(
        'INSERT INTO `tests`(`name`,`lab_id`) VALUES (?,?)',
        [req.body.name.trim(), req.body.labId],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/tests');
    
}).put('/tests', function(req, res, next) {
    connection.query(
        'UPDATE `tests` SET `name`=?, `lab_id`=? WHERE `id`=?',
        [req.body.name.trim(), req.body.labId, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/tests');
    
}).delete('/tests', function(req, res, next) {
    connection.query(
        'DELETE FROM `tests` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/tests/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM `tests` WHERE `id`=?; SELECT * FROM laboratories LIMIT 10;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        console.log(results[0][0]);
        res.render( 'test-edit', { title: 'Должность', data: results, csrfToken: req.csrfToken() } );
    });
    
});

module.exports = router;