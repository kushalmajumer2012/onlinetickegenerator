const express = require('express');
const app = express();
const cors = require('cors');
const {jira_connection} = require('../../connections/jira_connection');
const {projectkey} = require('../../assets/static/project_properties');
const { writeLog } = require('../../utility/writeLog')


app.use(cors());

const  jira_bugCreator = (emailEnvolope, callback) =>{
    jira_connection.issue.createIssue({
            fields: {
                project: {
                    key: projectkey,
                },
                summary: emailEnvolope.subject,
                description: emailEnvolope.text,
                issuetype: {
                    name: 'Bug'
                }
            }
    },function (error, issue){
        if(error){
            writeLog(error);
            return callback(error, undefined);
        }
        callback(undefined, issue.self);
    });
}

module.exports = {jira_bugCreator};