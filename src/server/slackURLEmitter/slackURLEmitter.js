var Slack = require('slack-node');
 
webhookUri = "__uri___";
 
slack = new Slack();
slack.setWebhook(webhookUri);
 
const  slackURLEmitter = (jiraURL) =>{
    slack.webhook({
    channel: "#general",
    username: "webhookbot",
    text: jiraURL
    }).then((response) =>{
        return response;
    }).catch((error) =>{
        return console.log(error);
    })
}

module.exports = slackURLEmitter;