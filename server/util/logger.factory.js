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
        const filename = getDateString() + ".log";
        
        if (typeof data === "object") {
            // array 
            data.forEach((line, i) => {
                fs.appendFileSync(__path__ + filename, (i === 0) ? getTimeString() + line + '\n' : "    " + line + '\n',
                    err => {
                        console.log("ERROR IN LOGGER => " + err);
                    });
            });
        } else {
            // string
            fs.appendFileSync(__path__ + filename, getTimeString() + data + '\n',
                err => {
                    console.log("ERROR IN LOGGER => " + err);
                });
        }
    } catch (e) {
        console.log("ERROR IN LOGGER", e);
    }
};

export const loggerAsMiddleware = (req, res, next) => {
    const filename = getDateString() + ".log";
    const data = 'request: ' + req.url + ', method: ' + req.method;
    fs.appendFileSync(__path__ + filename, getTimeString() + data + '\n',
                err => {
                    console.log("ERROR IN LOGGER => " + err);
                });
    next();
}