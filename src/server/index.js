var { resetEnvironment } = require('../utility/resetEnvironment');
const { writeLog } = require('../utility/writeLog');
var path = require("path");

const inputPath = path.join("../../Input")


const server = async ()=>{
    var reset_status = 0;
    await resetEnvironment(path.join(__dirname, inputPath)).then((data)=>{
        writeLog("application started");
        reset_status = 1;

    }).catch((e)=>{
        writeLog("environment reset failed!"+e);
    });

    if(reset_status!=0){
        var {imap}= require('../connections/imap_connection');
        var {jira_bugCreator} = require('./jira_bugCreator/jira_bugCreator');
        var gmailReader = require('./gmail_reader/gmailReader');
        await gmailReader(imap, jira_bugCreator)
   }
}

server();

