import express from 'express';
import 'babel-polyfill';
import mysql from 'mysql2/promise'
// import { fetch } from '../services/fetch.data';


const testRouter = express.Router();
// const connection = new Connection();
// testRouter.get('/here', async (req, res, next) => {
//     try {
//         const c = await connection.connect();
//         const [rows, fields] = await fetch.fetchFromDual(c);
//         await connection.end();
//         res.json({
//             awesome: rows
//         });
//     } catch(e) {
//         next(e);
//     }
// });

export default testRouter;