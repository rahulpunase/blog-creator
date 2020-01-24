import { fetch } from '../services/fetch.service';
import { UserService } from '../services/user.service';
import 'babel-polyfill';
import { pool } from '../config/config';
import { errors } from '../util/errors';

export const userController = {
    register: async (req, res, next) => {
        const db = await pool.getConnection();
        const userService = new UserService(db);
        const user = req.body;
        try {
            await db.query("START TRANSACTION");
            var regexp = /^[a-zA-Z0-9-_]+$/;
            if(!regexp.test(user.username)) {
                throw new Error(JSON.stringify(errors.USER_NOT_CORRECT));
            }
            // create party
            const [party] = await userService.createParty();
            if (party.insertId) {
                await userService.createPerson([party.insertId, user.first_name, '', user.last_name, user.username, user.email]);
                await userService.createUserLogin(party.insertId, user.username, user.password);
                if (user.preferences.length > 0) {
                    await userService.saveUserPreferences(party.insertId, user.preferences);
                }
            }
            await db.query("COMMIT");
            await db.release();
            res.json({
                success: true,
                error: false,
                message: 'User created successfully'
            });
        } catch(e) {
            //await connection.end();
            await db.query("ROLLBACK");
            await db.release();
            next(e);
        }
    },

    loginUser: async (req, res, next) => {
        const db = await pool.getConnection();
        const userService = new UserService(db);
        const user = req.body;
        console.log(user);

        try {
            const userInfo = await userService.loginUser(user.username, user.password, false);

            const visitorInfo = {
                timezoneOffset: user.userData.location.timezoneOffset,
                timezone: user.userData.location.timezone,
                longitude: user.userData.location.longitude,
                latitude: user.userData.location.latitude,
                user_agent: user.userData.userAgent,
                user_login: userInfo.user.username,
                party_id: userInfo.user.party_id,
                client_ip_addr:'',
                host_name: '',
                host_addr: '',
                token: userInfo.token,
                is_successfully_logged_in: 1,
                is_registering: user.userData.is_registering,
                is_registered_in_attempt: user.userData.is_registered_in_attempt
            };

            console.log(visitorInfo);
            // throw new Error(JSON.stringify(visitorInfo));
            if(userInfo) {
                await userService.createUserLoginHistory(visitorInfo);
            }
            res.json({
                success: true,
                error: false,
                user: userInfo
            })
            await db.release();
        } catch (e) {
            await db.query("ROLLBACK");
            await db.release();
            next(e);
        }
    }
};