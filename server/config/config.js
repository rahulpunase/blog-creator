import mysql from 'mysql2/promise'
import 'babel-polyfill';

// const connection = await dbCon.getConnection();
// try {
//   await connection.query('START TRANSACTION');
//   await query('INSERT INTO `tbl_activity_log` (dt, tm,userid,username,activity) VALUES(?,?,?,?,?)',
//                     ['2019-02-21', '10:22:01', 'S', 'Pradip', 'RAhul3']);
//   await dbCon.query('INSERT INTO `tbl_activity_log` (dt, tm,userid,username,activity) VALUES(?,?,?,?,?)', ['2019-02-21', '10:22:01', 'S', 'Pradip','this is test and the valid out put is this and then']);
//   await connection.release();
// } catch(e) {
//   await connection.query('ROLLBACK');
//   await connection.release();
// }

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'blogs',
    password: '123456',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});