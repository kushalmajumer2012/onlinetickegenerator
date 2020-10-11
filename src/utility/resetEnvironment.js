const fs = require('fs');
const path = require('path');
const { writeLog } = require('../utility/writeLog');
const filename = "log/log.txt";

const resetEnvironment = async (folderpath) =>{
    if(fs.existsSync(path.join(folderpath, filename))){ 
        await logFileReset(path.join(folderpath, filename)).then((result) =>{
            writeLog(result);
        }).catch((error)=>{
            writeLog(error)
            throw "application reset unsuccesful!"
        });
    }else{
        writeLog(path.join(folderpath, filename)+"does not exist");
        throw "application reset unsuccesful!"
    }
    return "environment reset succesfully";
}

const logFileReset = async (folderPath) =>{
    await fs.unlink(folderPath, (error)=>{
        if(error){
            return "log file reset unsuccesfully";
        }
    });
    return "log file reset succesfully";
}

module.exports = { resetEnvironment };