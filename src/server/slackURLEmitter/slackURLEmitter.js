var Slack = require('slack-node');
const { writeLog } = require('../../utility/writeLog');
 
webhookUri = "https://hooks.slack.com/services/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";
 
slack = new Slack();
slack.setWebhook(webhookUri);

console.log("entered in webhook slack")
 
const  slackURLEmitter = (jiraURL) =>{
    slack.webhook({
        channel: "#node-js",
        username: "kushalmajumer2012",
        text: jiraURL
    }, (error, data)=>{
        if(error){
            writeLog(error)
        }else{
            writeLog(data)
        }
    })
}

module.exports = {slackURLEmitter};