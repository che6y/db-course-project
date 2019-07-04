CREATE TABLE IF NOT EXISTS registry_reports (
      id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(100),
      registry_id VARCHAR(11) NOT NULL,
      customer_id int(11) UNSIGNED NOT NULL,
      staff_id INT(11) UNSIGNED NOT NULL,
      test_id INT(11) UNSIGNED NOT NULL,
      type_id INT(11) UNSIGNED NOT NULL,
      PRIMARY KEY (id, registry_id),
      INDEX (registry_id),
      INDEX (customer_id),
      INDEX (staff_id),
      INDEX (test_id),
      INDEX (type_id),
      FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (staff_id)
          REFERENCES staff(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (test_id)
          REFERENCES tests(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (type_id)
          REFERENCES types_of_check(id)
          ON UPDATE CASCADE ON DELETE CASCADE
);