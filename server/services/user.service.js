import { logger } from '../util/logger.factory';
import { errors } from '../util/errors';

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
    
}