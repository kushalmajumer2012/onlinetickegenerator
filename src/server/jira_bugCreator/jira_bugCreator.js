const express = require('express');
const app = express();
const cors = require('cors');
const {jira_connection} = require('../../connections/jira_connection');
const {projectkey} = require('../../assets/static/project_properties');
const { writeLog } = require('../../utility/writeLog');
var request = require('request');
const {basic_auth, host, strictSSL} = require('../../assets/static/jira_properties');
const fs = require('fs');


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
        console.log(issue.self)

        for(let i=0; i<emailEnvolope.attachmentsName.length; i++){

            const formData = {
                file: {
                    value: new Buffer(emailEnvolope.attachmentsContent[i], 'binary'),
                    options: {
                        filename: emailEnvolope.attachmentsName[i],
                        contentType: "multipart/form-data"
                    }
                }
            };

                const header = {
                    "Authentication": 'Basic ' + new Buffer(basic_auth.username + ':' + 'Kushmajum_801435').toString('base64'),
                    // ** IMPORTANT **
                    // "Use of the 'nocheck' value for X-Atlassian-Token
                    // has been deprecated since rest 3.0.0.
                    // Please use a value of 'no-check' instead."
                    "X-Atlassian-Token": jira_connection.basic_auth.password,
                    "Content-Type": "multipart/form-data"
                }
            
            const options = {
                url: issue.self+"/attachments",
                headers: header,
                method: "POST",
                formData: formData
            };

            const req = request(options, function(err, httpResponse, body) {
                //whatever_you_want;
                if(err){
                    console.log(err);
                }
                else{
                    console.log(req)
                }
            });
        }
        callback(undefined, issue.self);
    })
}

module.exports = {jira_bugCreator};