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
    
    connection.query('SELECT * FROM `laboratories` WHERE `id`=?;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'laboratory-edit', { title: 'Отделы', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Staff
router.get('/staff', function(req, res, next) {
    connection.query(
        'SELECT staff.id, staff.name, staff.surname, staff.fathers_name, positions.name AS position_name ' +
        'FROM staff ' +
        'LEFT JOIN position_held ' +
        'ON staff.id = position_held.staff_id ' +
        'LEFT JOIN positions ' +
        'ON positions.id = position_held.position_id;',
        function (error, results, fields) {
        if (error) throw error;
        res.render( './staff/staff', { title: 'Список специалистов', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/staff', function(req, res, next) {
    req.body.dismissalDate = req.body.dismissalDate.trim() != '' ? req.body.dismissalDate : null;
    connection.query(
        "INSERT INTO staff (name, surname, fathers_name) VALUES (?,?,?);",
        [req.body.name.trim(), req.body.surname.trim(), req.body.fathersName.trim()],
        function (error, results, fields) {
            if (error) throw error;
            connection.query(
                "INSERT INTO position_held (staff_id, position_id, employment_date, dismissal_date, rate) VALUES (?,?,?,?,?);",
                [ results.insertId, parseInt(req.body.positionId), null, null, parseInt(req.body.rate) ],
                function (error, results, fields) { console.log(error);if (error) throw error;}
            );
        }
    );
    
    res.redirect('/staff');
    
}).put('/staff', function(req, res, next) {
    req.body.dismissalDate = req.body.dismissalDate.trim() != '' ? req.body.dismissalDate : null;
    connection.query(
        'UPDATE staff SET name=?, surname=?, fathers_name=? WHERE id=?;' +
            'UPDATE position_held SET position_id=?, rate=?, employment_date=?, dismissal_date=? WHERE staff_id=?;',
        [req.body.name.trim(), req.body.surname.trim(), req.body.fathersName.trim(), req.body.id,
                req.body.positionId, req.body.rate, req.body.empDate, req.body.dismissalDate, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/staff');
    
}).delete('/staff', function(req, res, next) {
    connection.query(
        'DELETE FROM `staff` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) {
            console.log(results);
            if (error) throw error;}
    );
    
    res.redirect('back');
});


// Staff positions
router.get('/staff/positions', function(req, res, next) {
    connection.query('SELECT positions.id, positions.name, laboratories.name AS lab_name FROM positions LEFT JOIN laboratories ON positions.lab_id = laboratories.id; SELECT * FROM `laboratories`;', function (error, results, fields) {
        if (error) throw error;
        res.render( './staff/positions', { title: 'Список должностей', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/staff/positions', function(req, res, next) {
    connection.query(
        'INSERT INTO `positions`(`name`) VALUES (?)',
        [req.body.name.trim()],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/staff/positions');
    
}).put('/staff/positions', function(req, res, next) {
    connection.query(
        'UPDATE `positions` SET `name`=? WHERE `id`=?',
        [req.body.name.trim(), req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/staff/positions');
    
}).delete('/staff/positions', function(req, res, next) {
    connection.query(
        'DELETE FROM `positions` WHERE `id`=?',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/staff/positions/:id', function(req, res, next) {
    connection.query('SELECT * FROM `positions` WHERE `id`=?;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        console.log(results[0]);
        res.render( './staff/position-edit', { title: 'Должность', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

router.get('/staff/add', function(req, res, next) {
    connection.query(
        'SELECT * FROM `positions`',
        [ req.params.id ],
        function (error, results, fields) {
        if (error) throw error;
        
        res.render( './staff/staff-add', { title: 'Новый специалист', data: results, csrfToken: req.csrfToken() } );
    });
});

router.get('/staff/:id', function(req, res, next) {
    connection.query(
        'SELECT staff.id, staff.surname, staff.name, staff.fathers_name, positions.id as position_id, position_held.rate, position_held.employment_date, position_held.dismissal_date ' +
            'FROM staff ' +
            'LEFT JOIN position_held ' +
            'ON staff.id = position_held.staff_id ' +
            'LEFT JOIN positions ' +
            'ON positions.id = position_held.position_id WHERE staff.id=?;' +
            'SELECT * FROM positions;',
        [ req.params.id ],
        function (error, results, fields) {
            if (error) throw error;
            res.render( './staff/staff-edit', { title: 'Обновить данные', data: results, csrfToken: req.csrfToken() } );
        }
    );
});

// Tests
router.get('/tests', function(req, res, next) {
    connection.query(
        'SELECT tests.id, tests.name, laboratories.name AS lab_name ' +
        'FROM tests ' +
        'LEFT JOIN laboratories ' +
        'ON tests.lab_id = laboratories.id; ' +
        'SELECT * FROM laboratories LIMIT 10;',
        function (error, results, fields) {
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
        'DELETE FROM `tests` WHERE `id`=?;',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/tests/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM tests WHERE id=?; SELECT * FROM laboratories;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'test-edit', { title: 'Должность', data: results, csrfToken: req.csrfToken() } );
    });
    
});

module.exports = router;