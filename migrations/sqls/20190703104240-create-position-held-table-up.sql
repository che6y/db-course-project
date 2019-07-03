CREATE TABLE IF NOT EXISTS position_held (
      id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      staff_id INT(11) UNSIGNED NOT NULL,
      position_id INT(11) UNSIGNED NOT NULL,
      employment_date DATE NOT NULL,
      dismissal_date DATE,
      rate INT(11) NOT NULL,
      PRIMARY KEY (id),
      INDEX (staff_id),
      INDEX (position_id),
      FOREIGN KEY (staff_id)
          REFERENCES staff(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (position_id)
          REFERENCES positions(id)
          ON UPDATE CASCADE ON DELETE CASCADE
);