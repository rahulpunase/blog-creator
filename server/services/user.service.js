import { logger, loggerAsMiddleware } from '../util/logger.factory';
import { errors } from '../util/errors';
var passwordHash = require('password-hash');
import jwt from 'jsonwebtoken';

export class UserService {
    constructor(db) {
        this.db = db;
    }

    async createParty ()  {
        return await this.db.execute("INSERT INTO `blogs`.`party`(`party_type`,`description`,`status_id`,`created_date`,`rowstate`) VALUES ('PERSON', '', 'ACTIVE', now(), 1)", []);
    }

    async createPerson (data) {
        // 6 parameters 
        if (await this.checkIfEmailAlreadyExist(data[5])) {
            throw new Error(JSON.stringify(errors.EMAIL_ALREADY_EXISTS));
        }
        if (await this.checkIfUsernameAlreadyExist(data[4])) {
            throw new Error(JSON.stringify(errors.USERNAME_ALREADY_EXISTS));
        }
        return await this.db.execute("INSERT INTO `blogs`.`person` (`party_id`, `first_name`, `middle_name`, `last_name`, `username`, `email`, `created_date`, `rowstate`) VALUE (?, ?, ?, ?, ?, ?, now(), 1)", data);
    }

    async saveUserPreferences (party_id, userPreferences) {
        let query = "INSERT INTO `blogs`.`user_blog_preferences` (`party_id`, `preference_id`, `created_date`, `updated_date`, `rowstate`) VALUES ";
        let vals =  "(?, ?, now(), now(), 1)";
        const comma = ", ";
        const preparedArray = [];

        userPreferences.forEach((userPreference, index) => {
            (index !== userPreferences.length - 1) ? query += vals + comma : query += vals; 
            preparedArray.push(party_id);
            preparedArray.push(userPreference);
        });
        const sql = this.db.format(query, preparedArray);
        logger(sql);
        return await this.db.query(sql);
    }

    async checkIfEmailAlreadyExist (email) {
        const [rows, fields] =  await this.db.execute("SELECT `party_id` from `blogs`.`person` where `email` = ?", [email]);
        return rows.length > 0;
    }

    async checkIfUsernameAlreadyExist (username) {
        const [rows, fields] =  await this.db.execute("SELECT `party_id` from `blogs`.`person` where `username` = ?", [username]);
        return rows.length > 0;
    }

    async createUserLogin (party_id, username, password) {
        const hashedPassword =  passwordHash.generate(password);
        return await this.db.execute("INSERT INTO `blogs`.`user_login`(`user_login_id`,`current_password`,`is_system`,`enabled`,`successive_failed_login`,`last_stamp`,`created_stamp`,`party_id`,`salt`) VALUES (?, ?, 0, 1, 0, now() ,now(), ?, 'SHA')", [username, hashedPassword, party_id]);
    }

    async getUserInfoFromPartyId(party_id) {
        return await this.db.execute("SELECT `party_id`,`salutation`,`first_name`,`middle_name`,`last_name`,`username`,`gender`,`birthdate`,`email`,`phone_number`,`created_date`,`rowstate` FROM `blogs`.`person` where `party_id` = ? and `rowstate` = 1", [party_id]);
    }

    async getUserLoginFromPartyId(party_id) {
        return await this.db.execute("SELECT `party_id`,`salutation`,`first_name`,`middle_name`,`last_name`,`username`,`gender`,`birthdate`,`email`,`phone_number`,`created_date`,`rowstate` FROM `blogs`.`person` where `party_id` = ? and `rowstate` = 1", [party_id]);
    }

    async loginUser (username, password, isFirstTimeRegistering) {
        const [rows, fields] = await this.db.execute("SELECT `party_id`, `current_password`, `enabled`, `successive_failed_login`, `require_password_change` FROM `blogs`.`user_login` WHERE `user_login_id` = ?", [username]);

        if (rows.length === 0) {
            throw new Error(JSON.stringify(errors.USER_NOT_FOUND));

        } else if (rows[0].enabled === 0) {
            throw new Error(JSON.stringify(errors.USER_DISABLED));

        } else if (!passwordHash.verify(password, rows[0].current_password)) {
            const [succ, fields] = await this.db.execute("select `successive_failed_login` from `blogs`.`user_login` where `user_login_id` = ?", [username]);
            if(Number(succ[0].successive_failed_login) === 2) {
                await this.disableUser(username);
                throw new Error(JSON.stringify(errors.USER_DISABLED));
            }
            
            const sql = this.db.format("UPDATE `blogs`.`user_login` SET `successive_failed_login`  = (?) where `user_login_id` = ?", [Number(succ[0].successive_failed_login) + 1, username]);
            const [field] = await this.db.query(sql);
            throw new Error(JSON.stringify(errors.PASSWORD_INCORRECT));

        } else {
            // log in user
            const [user, field] = await this.getUserInfoFromPartyId(rows[0].party_id);
            return {
                token: this.createUserToken({
                    party_id: user[0].party_id,
                    username: user[0].username,
                    email: user[0].email 
                }),
                user: user[0]
            };
        }
    }

    async disableUser(username) {
        await this.db.execute("UPDATE `blogs`.`user_login` SET `enabled` = 0, `disable_date_time` = now() where user_login_id = ?", [username]);
    }

    /*
    * checks if the user is disabled, return true if user is disabled
    * @user either username, partyid, or email address
    */
    async isUserDisabled(user) {
        // it is a party id, fetch user
        const [rows, fields] = await this.db.execute("SELECT `status_id`, `enabled` FROM `blogs`.`user_info_from_party_id` where party_id = ? or user_login_id = ?", [user, user]);
        if (rows.length) {
            return (rows[0].status_id === 'ACTIVE' && rows[0].enabled === 0); 
        } else {
            return false;
        }
    }
    
    createUserToken(userInfo) {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: userInfo
          }, 'BLOGGER');
    }

    async createUserLoginHistory(vistorInfo) {
        // create location first
        const [location] = await this.db.execute("INSERT INTO `blogs`.`user_login_location` (`timezone`, `timezone_offset`, `longitude`, `latitude`, `created_date`) VALUES (?,?,?,?,now())", [vistorInfo.timezone, vistorInfo.timezoneOffset, vistorInfo.longitude, vistorInfo.latitude]);

        const sql = this.db.format("INSERT INTO `blogs`.`user_login_history` (`user_agent`,`location_id`,`user_login`,`party_id`, `client_ip_addr`,`host_name`,`host_addr`,`token`,`is_successfully_logged_in`,`is_registering`,`is_registered_in_attempt`, `last_updated_date`,`created_date`,`is_logout_from_token`,`rowstate`) VALUES (?,?,?,?,?,?,?,?,?,?,?, now(), now(), 0, 1)", [vistorInfo.user_agent, location.insert_id, vistorInfo.user_login, vistorInfo.party_id, vistorInfo.client_ip_addr, vistorInfo.host_name, vistorInfo.host_addr, vistorInfo.token, vistorInfo.is_successfully_logged_in, vistorInfo.is_registering, vistorInfo.is_registered_in_attempt]);

        logger("=======================LOGIN ATTEMPTTED=======================");
        logger(sql);

        return await this.db.query(sql);
    }
    
}