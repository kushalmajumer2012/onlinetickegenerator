//const {readPropertiesFile} = require('../utility/readPropertiesFle');
var path = require("path");
const filename = "jira_properties.json";
const fs = require('fs');
const { writeLog } = require('../../utility/writeLog');

const folderpath = path.join(__dirname,"../../../Input");


if(!fs.existsSync(path.join(folderpath, filename))){
    writeLog(path.join(folderpath, filename)+"file does not exist");
    module.exports = {};
    return;
}
const data = JSON.parse(fs.readFileSync(path.join(folderpath, filename)));
writeLog("Properties read from "+filename);

module.exports = {
    basic_auth: data.basic_auth,
    host: data.host,
    strictSSL: data.strictSSL,
};