var JiraClient = require('jira-connector');
const {basic_auth, host, strictSSL} = require('../assets/static/jira_properties');
const { writeLog } = require('../utility/writeLog')

console.log("entering")

try{
    var jira_connection = new JiraClient({
        basic_auth,
        host,
        strictSSL
    });
}catch(e){
    return writeLog("jira connection not established …..");
}

writeLog("jira connection established …..");
module.exports= {jira_connection};