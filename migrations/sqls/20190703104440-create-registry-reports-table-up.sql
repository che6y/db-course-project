CREATE TABLE IF NOT EXISTS registry_reports (
      id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      registry_id VARCHAR(11) NOT NULL,
      customer_id int(11) UNSIGNED NOT NULL,
      ph_id INT(11) UNSIGNED NOT NULL,
      test_id INT(11) UNSIGNED NOT NULL,
      type_id INT(11) UNSIGNED NOT NULL,
      created_at DATE Not NULL,
      PRIMARY KEY (id, registry_id),
      INDEX (registry_id),
      INDEX (customer_id),
      INDEX (ph_id),
      INDEX (test_id),
      INDEX (type_id),
      FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (ph_id)
          REFERENCES position_held(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (test_id)
          REFERENCES tests(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (type_id)
          REFERENCES types_of_check(id)
          ON UPDATE CASCADE ON DELETE CASCADE
);