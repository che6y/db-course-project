CREATE TABLE IF NOT EXISTS laboratory_reports (
     id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     registry_id VARCHAR(11) NOT NULL,
     staff_id INT(11) UNSIGNED NOT NULL,
     deviation TINYINT,
     analysis_date DATE NOT NULL,
     rate INT(11) NOT NULL,
     PRIMARY KEY (id),
     INDEX (staff_id),
     INDEX (registry_id),
     FOREIGN KEY (staff_id)
         REFERENCES staff(id)
         ON UPDATE CASCADE ON DELETE CASCADE,
     FOREIGN KEY (registry_id)
         REFERENCES registry_reports(registry_id)
         ON UPDATE CASCADE ON DELETE CASCADE
);