const fs = require('fs');
const path = require('path');
const { writeLog } = require('../utility/writeLog');


const readPropertiesFile = async (folderpath, filename)=>{
    if(!fs.existsSync(path.join(folderpath, filename))){
        writeLog(path.join(folderpath, filename)+"file does not exist");
        return;
    }
    const data = await fs.readFileSync(path.join(folderpath, filename));
    return data;
}

module.exports = { readPropertiesFile }