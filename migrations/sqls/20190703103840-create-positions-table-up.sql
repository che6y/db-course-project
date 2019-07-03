CREATE TABLE IF NOT EXISTS positions (
     id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     name VARCHAR(30),
     lab_id INT(11) UNSIGNED NOT NULL,
     PRIMARY KEY (id),
     INDEX (lab_id),
     FOREIGN KEY (lab_id)
         REFERENCES laboratories(id)
         ON UPDATE CASCADE ON DELETE CASCADE
);