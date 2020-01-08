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

