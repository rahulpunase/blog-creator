CREATE TABLE `user_login` (
  `user_login_id` varchar(250) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `current_password` varchar(255) COLLATE latin1_general_cs DEFAULT NULL,
  `password_hint` varchar(255) COLLATE latin1_general_cs DEFAULT NULL,
  `is_system` char(1) COLLATE latin1_general_cs DEFAULT NULL,
  `enabled` char(1) COLLATE latin1_general_cs DEFAULT NULL,
  `has_logged_out` char(1) COLLATE latin1_general_cs DEFAULT NULL,
  `require_password_change` char(1) COLLATE latin1_general_cs DEFAULT NULL,
  `disable_date_time` datetime DEFAULT NULL,
  `successive_failed_login` decimal(20,0) DEFAULT NULL,
  `external_auth_id` varchar(250) COLLATE latin1_general_cs DEFAULT NULL,
  `last_stamp` datetime DEFAULT NULL,
  `created_stamp` datetime DEFAULT NULL,
  `party_id` varchar(20) COLLATE latin1_general_cs DEFAULT NULL,
  `salt` varchar(36) COLLATE latin1_general_cs DEFAULT NULL,
  PRIMARY KEY (`user_login_id`));

ALTER TABLE `blogs`.`user_login` 
CHANGE COLUMN `is_system` `is_system` INT(1) NULL DEFAULT NULL ,
CHANGE COLUMN `enabled` `enabled` INT(1) NULL DEFAULT NULL ,
CHANGE COLUMN `has_logged_out` `has_logged_out` INT(1) NULL DEFAULT NULL;

ALTER TABLE `blogs`.`user_login` 
CHANGE COLUMN `external_auth_id` `external_auth_id` VARCHAR(250) CHARACTER SET 'latin1' NULL DEFAULT NULL AFTER `disable_date_time`;

-- visit
CREATE TABLE `blogs`.`user_login_history` (
  `history_id` INT NOT NULL,
  `user_agent` VARCHAR(100) NULL,
  `location_id` INT NULL,
  `user_login` VARCHAR(45) NULL,
  `party_id` INT NULL,
  `client_ip_addr` VARCHAR(45) NULL,
  `host_name` VARCHAR(45) NULL,
  `host_addr` VARCHAR(45) NULL,
  `token` VARCHAR(200) NULL,
  `is_successfully_logged_in` INT NULL,
  `is_registering` INT NULL,
  `is_registered_in_attempt` INT NULL,
  `last_updated_date` DATETIME NULL,
  `created_date` DATETIME NULL,
  `is_logout_from_token` INT NULL,
  `rowstate` INT NULL,
  PRIMARY KEY (`history_id`),
  INDEX `fk_user_login_history_1_idx` (`party_id` ASC),
  CONSTRAINT `fk_user_login_history_1`
    FOREIGN KEY (`party_id`)
    REFERENCES `blogs`.`party` (`party_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER Table `blogs`.`user_login_history` AUTO_INCREMENT = 1000000;
