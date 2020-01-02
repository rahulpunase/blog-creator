import { fetch } from '../services/fetch.service';
import 'babel-polyfill';
import { pool } from '../config/config';

export const startController = {
    fetchCategories: async (req, res, next) => {
        const db = await pool.getConnection();
        try {
            const [rows, fields] = await fetch.fetchCategories(db);
            await db.release();
            res.json({
                categories: rows,
                categoriesCount: rows.length
            });
        } catch(e) {
            //await connection.end();
            await db.release();
            next(e);
        }
    }
};