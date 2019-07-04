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

// Lab reports
router.get('/lab-reports', function(req, res, next) {
    connection.query('SELECT lr.id, lr.registry_id, lr.deviation, lr.analysis_date, staff.name, staff.surname, staff.fathers_name ' +
        'FROM laboratory_reports AS lr ' +
        'LEFT JOIN staff ' +
        'ON lr.staff_id = staff.id ' +
        'ORDER BY lr.id DESC ' +
        'LIMIT 50;' +
        'SELECT * FROM laboratories; ' +
        'SELECT registry_id FROM registry_reports; ' +
        'SELECT * FROM staff;', function (error, results, fields) {
        if (error) throw error;
        res.render( 'lab-reports', { title: 'Результаты анализов', data: results, csrfToken: req.csrfToken() } );
    });
}).post('/lab-reports', function(req, res, next) {
        connection.query(
            'INSERT INTO laboratory_reports (registry_id, staff_id, deviation, lab_id, analysis_date) VALUES (?,?,?,?,?);',
            [req.body.registryId, req.body.staffId, req.body.deviation, req.body.labId, req.body.analysisDate],
            function (error, results, fields) {
                if (error) throw error;
                res.redirect('/lab-reports');
            }
        );
    }
).put('/lab-reports', function(req, res, next) {
        connection.query(
            'UPDATE laboratory_reports ' +
            'SET registry_id=?, staff_id=?, deviation=?, lab_id=? ' +
            'WHERE id=?;',
            [req.body.registryId, req.body.staffId, req.body.deviation, req.body.labId, req.body.id],
            function (error, results, fields) { if (error) throw error; }
        );
        
        res.redirect('/lab-reports');
    }
).delete('/lab-reports', function(req, res, next) {
        connection.query(
            'DELETE FROM laboratory_reports WHERE id=?',
            [req.body.id],
            function (error, results, fields) { if (error) throw error;}
        );
        
        res.redirect('back');
    }
);
router.get('/lab-reports/add', function(req, res, next) {
    connection.query(
        'SELECT registry_id, id FROM registry_reports; ' +
        'SELECT * FROM staff; ' +
        'SELECT * FROM laboratories;',function (error, results, fields) {
            if (error) throw error;
            res.render( 'lab-report-add', { title: 'Добавить запись', data: results, csrfToken: req.csrfToken() } );
        });
    
});
router.get('/lab-reports/:id', function(req, res, next) {
    connection.query('SELECT * FROM laboratory_reports WHERE id=?; ' +
        'SELECT registry_id, id FROM registry_reports; ' +
        'SELECT * FROM staff; ' +
        'SELECT * FROM laboratories;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( 'lab-report-edit', { title: 'Изменить запись', data: results, csrfToken: req.csrfToken() } );
    });
    
});


// Registry
router.get('/registry', function(req, res, next) {
    connection.query(
        'SELECT rr.id, rr.registry_id, rr.name, tests.name AS test_name, types_of_check.name AS type_name, customers.name AS customer_name ' +
        'FROM registry_reports AS rr ' +
        'LEFT JOIN tests ON rr.test_id = tests.id ' +
        'LEFT JOIN types_of_check ON rr.type_id = types_of_check.id ' +
        'LEFT JOIN customers ON rr.customer_id = customers.id ' +
        'ORDER BY rr.id DESC', function (error, results, fields) {
        if (error) throw error;
        res.render('./registry/registry', { title: 'Прием проб', data: results, csrfToken: req.csrfToken() });
    });
}).post('/registry', function(req, res, next) {
        connection.query(
            'INSERT INTO registry_reports (name, registry_id, customer_id, test_id, type_id, staff_id) VALUES (?,?,?,?,?,?)',
            [req.body.name, req.body.registryId, req.body.customerId, req.body.testId, req.body.typeId, req.body.staffId],
            function (error, results, fields) {
                if (error) throw error;
                res.redirect('/registry');
            }
        );
    }
).put('/registry', function(req, res, next) {
        connection.query(
            'UPDATE registry_reports ' +
            'SET name=?, registry_id=?, customer_id=?, test_id=?, type_id=?, staff_id=? ' +
            'WHERE id=?;',
            [req.body.name, req.body.registryId, req.body.customerId, req.body.testId, req.body.typeId, req.body.staffId, req.body.id],
            function (error, results, fields) { if (error) throw error; }
        );
        
        res.redirect('/registry');
    }
).delete('/registry', function(req, res, next) {
        connection.query(
            'DELETE FROM registry_reports WHERE id=?',
            [req.body.id],
            function (error, results, fields) { if (error) throw error;}
        );
        
        res.redirect('back');
    }
);
router.get('/registry/add', function(req, res, next) {
    connection.query(
        'SELECT * FROM types_of_check; ' +
        'SELECT id, name FROM tests; ' +
        'SELECT id, name FROM customers; ' +
        'SELECT * FROM staff;',function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/registry-add', { title: 'Добавить запись', data: results, csrfToken: req.csrfToken() } );
    });
    
});

router.get('/registry/:id', function(req, res, next) {
    connection.query('SELECT * FROM registry_reports WHERE id=?; ' +
        'SELECT * FROM types_of_check; ' +
        'SELECT id, name FROM tests; ' +
        'SELECT id, name FROM customers; ' +
        'SELECT * FROM staff;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/registry-edit', { title: results[0][0].name + ' - Изменить', data: results, csrfToken: req.csrfToken() } );
    });
    
});
router.post('/registry/search', function(req, res, next) {
    var where = '';
    if ( req.body.findBy === 'customer' )
        where = 'WHERE customers.name LIKE ?;';
    else if ( req.body.findBy === 'name' )
        where = 'WHERE rr.name LIKE ?;';
    else
        where = 'WHERE rr.registry_id LIKE ?;'
    connection.query(
        'SELECT rr.id, rr.registry_id, rr.name, tests.name AS test_name, types_of_check.name AS type_name, customers.name AS customer_name ' +
        'FROM registry_reports AS rr ' +
        'LEFT JOIN tests ON rr.test_id = tests.id ' +
        'LEFT JOIN types_of_check ON rr.type_id = types_of_check.id ' +
        'LEFT JOIN customers ON rr.customer_id = customers.id ' +
        where ,[ '%' + req.body.word + '%'],function (error, results, fields) {
            if (error) throw error;
            res.render( './registry/registry', { title: 'Результаты поиска: '+ req.body.word, data: results, csrfToken: req.csrfToken() } );
        });
    
});
router.post('/registry/order', function(req, res, next) {
    var orderBy = '';
    if ( req.body.orderBy === 'customer_name' )
        orderBy = 'ORDER BY customers.name ';
    else if ( req.body.orderBy === 'name' )
        orderBy = 'ORDER BY rr.name ';
    else if ( req.body.orderBy === 'test_name' )
        orderBy = 'ORDER BY test_name ';
    else if ( req.body.orderBy === 'type_name' )
        orderBy = 'ORDER BY type_name ';
    else
        orderBy = 'ORDER BY rr.registry_id ';
    connection.query(
        'SELECT rr.id, rr.registry_id, rr.name, tests.name AS test_name, types_of_check.name AS type_name, customers.name AS customer_name ' +
        'FROM registry_reports AS rr ' +
        'LEFT JOIN tests ON rr.test_id = tests.id ' +
        'LEFT JOIN types_of_check ON rr.type_id = types_of_check.id ' +
        'LEFT JOIN customers ON rr.customer_id = customers.id ' +
        orderBy +
        (req.body.order === 'desc' ? 'DESC;' : 'ASC;')  ,function (error, results, fields) {
            if (error) throw error;
            res.render( './registry/registry', { title: 'Результат', data: results, csrfToken: req.csrfToken() } );
        });
    
});


// Type of check
router.get('/type-of-check', function(req, res, next) {
    connection.query('SELECT * FROM types_of_check ORDER BY id DESC LIMIT 10;', function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/type-of-check', { title: 'Вид проверки', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/type-of-check', function(req, res, next) {
    connection.query(
        'INSERT INTO types_of_check(name) VALUES (?);',
        [req.body.name],
        function (error, results, fields) { if (error) throw error; }
    );
    res.redirect('/type-of-check');
}).put('/type-of-check', function(req, res, next) {
    connection.query(
        'UPDATE types_of_check SET name=? WHERE id=?;',
        [req.body.name, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/type-of-check');
    
}).delete('/type-of-check', function(req, res, next) {
    connection.query(
        'DELETE FROM types_of_check WHERE id=?;',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/type-of-check/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM types_of_check WHERE id=?;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/type-of-check-item', { title: results[0].name + ' - Изменить', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Customers
router.get('/customers', function(req, res, next) {
    
    connection.query('SELECT * FROM customers ORDER BY name ASC LIMIT 20;', function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/customers', { title: 'Заказчики', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/customers', function(req, res, next) {
    connection.query(
        'INSERT INTO customers(name,address) VALUES (?,?);',
        [req.body.name, req.body.address],
        function (error, results, fields) { if (error) throw error; }
    );
    res.redirect('/customers');
}).put('/customers', function(req, res, next) {
    connection.query(
        'UPDATE customers SET name=?, address=? WHERE id=?;',
        [req.body.name, req.body.address, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/customers');
    
}).delete('/customers', function(req, res, next) {
    connection.query(
        'DELETE FROM customers WHERE id=?;',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/customers/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM customers WHERE id=?;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/customer-edit', { title: results[0].name + ' - Изменить', data: results[0], csrfToken: req.csrfToken() } );
    });
    
});

// Laboratories
router.get('/laboratories', function(req, res, next) {
    connection.query('SELECT * FROM laboratories ORDER BY name ASC LIMIT 10;', function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/laboratories', { title: 'Отделы', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/laboratories', function(req, res, next) {
    connection.query(
        'INSERT INTO laboratories(name) VALUES (?);',
        [req.body.name.trim()],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/laboratories');
    
}).put('/laboratories', function(req, res, next) {
    connection.query(
        'UPDATE laboratories SET name=? WHERE id=?;',
        [req.body.name.trim(), req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/laboratories');
    
}).delete('/laboratories', function(req, res, next) {
    connection.query(
        'DELETE FROM laboratories WHERE id=?;',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/laboratory/:id', function(req, res, next) {
    
    connection.query('SELECT * FROM laboratories WHERE id=?;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/laboratory-edit', { title: 'Отделы', data: results[0], csrfToken: req.csrfToken() } );
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
        'ON positions.id = position_held.position_id ' +
        'ORDER BY surname ASC;',
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
                [ results.insertId, req.body.positionId, req.body.empDate, req.body.dismissalDate, req.body.rate ],
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
        'DELETE FROM staff WHERE id=?',
        [req.body.id],
        function (error, results, fields) {
            console.log(results);
            if (error) throw error;}
    );
    
    res.redirect('back');
});
// Staff Search
router.post('/staff/search', function(req, res, next) {
    connection.query(
        "SELECT staff.id, staff.name, staff.surname, staff.fathers_name, positions.name AS position_name " +
        "FROM staff " +
        "LEFT JOIN position_held " +
        "ON staff.id = position_held.staff_id " +
        "LEFT JOIN positions " +
        "ON positions.id = position_held.position_id " +
        "WHERE staff.surname LIKE ?;", [ '%' + req.body.surname + '%'],
        function (error, results, fields) {
            console.log(error);
            if (error) throw error;
            res.render( './staff/staff', { title: 'Результаты поиска: ' + req.body.surname, data: results, csrfToken: req.csrfToken() } );
        });
    
});

// Staff positions
router.get('/staff/positions', function(req, res, next) {
    connection.query(
        'SELECT positions.id, positions.name, laboratories.name AS lab_name ' +
        'FROM positions ' +
        'LEFT JOIN laboratories ' +
        'ON positions.lab_id = laboratories.id ' +
        'ORDER BY positions.name LIMIT 30; ' +
        'SELECT * FROM laboratories;', function (error, results, fields) {
        if (error) throw error;
        res.render( './staff/positions', { title: 'Список должностей', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/staff/positions', function(req, res, next) {
    connection.query(
        'INSERT INTO positions(name, lab_id) VALUES (?,?);',
        [req.body.name.trim(), req.body.labId],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/staff/positions');
    
}).put('/staff/positions', function(req, res, next) {
    connection.query(
        'UPDATE positions SET name=?, lab_id=? WHERE id=?;',
        [req.body.name.trim(), req.body.labId, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/staff/positions');
    
}).delete('/staff/positions', function(req, res, next) {
    connection.query(
        'DELETE FROM positions WHERE id=?;',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/staff/positions/:id', function(req, res, next) {
    connection.query(
        'SELECT * FROM positions WHERE id=?; ' +
        'SELECT * FROM laboratories;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( './staff/position-edit', { title: 'Должность', data: results, csrfToken: req.csrfToken() } );
    });
    
});

router.get('/staff/add', function(req, res, next) {
    connection.query(
        'SELECT * FROM positions;',
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
            'ON positions.id = position_held.position_id ' +
            'WHERE staff.id=?;' +
            'SELECT * FROM positions;',
        [ req.params.id ],
        function (error, results, fields) {
            if (error) throw error;
            results[0][0].employment_date = results[0][0].employment_date !== null ? results[0][0].employment_date.toISOString().substring(0,10) : null;
            results[0][0].dismissal_date = results[0][0].dismissal_date !== null ? results[0][0].dismissal_date.toISOString().substring(0,10) : null;
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
            res.render( './registry/tests', { title: 'Список проверок', data: results, csrfToken: req.csrfToken() } );
    });
    
}).post('/tests', function(req, res, next) {
    connection.query(
        'INSERT INTO tests(name,lab_id) VALUES (?,?);',
        [req.body.name.trim(), req.body.labId],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/tests');
    
}).put('/tests', function(req, res, next) {
    connection.query(
        'UPDATE tests SET name=?, lab_id=? WHERE id=?;',
        [req.body.name.trim(), req.body.labId, req.body.id],
        function (error, results, fields) { if (error) throw error; }
    );
    
    res.redirect('/tests');
    
}).delete('/tests', function(req, res, next) {
    connection.query(
        'DELETE FROM tests WHERE id=?;',
        [req.body.id],
        function (error, results, fields) { if (error) throw error;}
    );
    
    res.redirect('back');
});
router.get('/tests/:id', function(req, res, next) {
    
    connection.query(
        'SELECT * FROM tests WHERE id=?; ' +
        'SELECT * FROM laboratories;', [ req.params.id ],function (error, results, fields) {
        if (error) throw error;
        res.render( './registry/test-edit', { title: 'Должность', data: results, csrfToken: req.csrfToken() } );
    });
    
});

module.exports = router;