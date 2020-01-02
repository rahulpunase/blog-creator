import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './config/config';
import { logger } from '../server/util/logger.factory';

import testRouter from './routers/test.router';
import startRouter from './routers/start.router';
import userRouter from './routers/user.router';

const app = express();
app.use(cors({
    origin: ["http://localhost:4200"]
}));

// LoggerFactory.createDirectory();
/* Other middlewares and routes */
// logger('-------------SERVER STARTED-------------');
/* ----------------------------- BODY PARSER -----------------------------*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* ----------------------------- BODY PARSER -----------------------------*/


app.use('/t', testRouter);
app.use('/start', startRouter);
app.use('/user', userRouter);


app.listen(3000, (err) => {
    if (err) {
        console.log('Error in starting the server.');
    } else {
        console.log('Server started successfully.');
    }
});
app.use((err, req, res, next) => {
    logger("<----------------------SERVER ERROR---------------------->");
    let errObj = '';
    try {
        errObj = JSON.parse(err.message);
        // errorStatusCode
        // errorMessage
        logger(err.stack.split('\n'));
        if (errObj.errorStatusCode !== 500) {
            res.status(200).json({
                error: {...errObj, ...{error: true}},
            });
        } else {
            res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    } catch (e) {
        logger('<--------------PARSING ERROR AT server.js-------------->');
        console.log('Could not parse');
        logger(err.stack.split('\n'));
        res.status(500).json({
            message: err.message,
            status: 500
        });
    }
    
});