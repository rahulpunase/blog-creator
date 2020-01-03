import fs from 'fs';

function getTimeString() {
    const d = new Date();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const seconds = d.getSeconds();
    return ((hour < 10) ? ("0" + hour) : hour) + ":" + ((minute < 10) ? ("0" + minute) : minute) + ":" + ((seconds < 10) ? ("0" + seconds) : seconds) + " ==> ";
}
function getDateString() {
    const d = new Date();
    const date = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return ((date <= 10) ? ("0" + date) : date) + "-" + ((month <= 10) ? ("0" + month) : month) + "-" + ((year <= 10) ? ("0" + year) : year);
}


const __path__ = "./server/logs/server.logs/";

/** 
 * logger takes array of string or string as parameter
 * @data , either string or an array
*/
export const logger = (data) => {
    try {
        console.log('Directory', __dirname);
        const date = new Date();
        const dir = __path__ + "" + date.toDateString().substring(11, 15) + "/" + date.toDateString().substring(4, 7) + "/";
        console.log('Directory', dir);
        if (!fs.existsSync(dir)) {
            // creating directory
            fs.mkdirSync(dir, { recursive: true }, err => {
                if (err) throw err;
            });
        }
        const filename = getDateString() + ".log";

        if (typeof data === "object") {
            // array 
            data.forEach((line, i) => {
                fs.appendFileSync(dir + filename, (i === 0) ? getTimeString() + line + '\n' : "    " + line + '\n',
                    err => {
                        console.log("ERROR IN LOGGER => " + err);
                    });
            });
        } else {
            // string
            fs.appendFileSync(dir + filename, getTimeString() + data + '\n',
                err => {
                    console.log("ERROR IN LOGGER => " + err);
                });
        }
    } catch (e) {
        console.log("ERROR IN LOGGER", e);
    }
};

export const loggerAsMiddleware = (req, res, next) => {
    console.log('Directory', __dirname);
    const date = new Date();
    const dir = __path__ + "" + date.toDateString().substring(11, 15) + "/" + date.toDateString().substring(4, 7) + "/";

    if (!fs.existsSync(dir)) {
        // creating directory
        fs.mkdirSync(dir, { recursive: true }, err => {
            if (err) throw err;
        });
    }

    const filename = getDateString() + ".log";
    const data = 'request: ' + req.url + ', method: ' + req.method;
    fs.appendFileSync(dir + filename, getTimeString() + data + '\n',
        err => {
            console.log("ERROR IN LOGGER => " + err);
        });
    next();
}