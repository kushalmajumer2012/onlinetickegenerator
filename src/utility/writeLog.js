const fs = require('fs');
const path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();
dt.format('m/d/Y H:M:S');

const folderpath = __dirname+"../../../Input/log";
const filename = "log.txt";

var writeLog = async (data)=>{
    if (!fs.existsSync(path.join(folderpath, filename))) {
        await fs.writeFileSync(path.join(folderpath, filename), data+" "+new Date(dt.now())+'\r\n', function (err) {
            if (err){
                return console.log('error while writing a in Log File' + new Date(dt.now())+'\r\n');
            }
        });
    }
    await fs.appendFileSync(path.join(folderpath, filename), data+" "+new Date(dt.now())+'\r\n', function (err) {
        if (err) {
            return console.log('error while writing a in Log File' + new Date(dt.now())+'\r\n');
        }
    })
}

module.exports = { writeLog };