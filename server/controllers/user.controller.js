import { fetch } from '../services/fetch.service';
import { UserService } from '../services/user.service';
import 'babel-polyfill';
import { pool } from '../config/config';

export const userController = {
    register: async (req, res, next) => {
        const db = await pool.getConnection();
        const userService = new UserService(db);
        const user = req.body;
        try {
            await db.query("START TRANSACTION");
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
        try {
            const userInfo = await userService.loginUser(user.username, user.password, false);
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