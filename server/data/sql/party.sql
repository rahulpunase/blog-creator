CREATE TABLE `party` (
  `party_id` int(11) NOT NULL AUTO_INCREMENT,
  `party_type` varchar(45) DEFAULT NULL,
  `description` varchar(450) DEFAULT NULL,
  `status_id` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `rowstate` int(11) DEFAULT ''1'',
  PRIMARY KEY (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000066 DEFAULT CHARSET=latin1