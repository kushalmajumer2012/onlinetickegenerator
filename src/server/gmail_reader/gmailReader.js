var fs = require("fs");
// var base64 = require("base64-stream");
// var path = require("path");
var simpleParser = require("mailparser").simpleParser;
const { writeLog } = require('../../utility/writeLog')

// const dir = "static";
const gmailReader = async (imap, jira_bugCreator) =>{
    
    //Once the mail box is read to open
    await imap.once("ready", () => {
        imap.openBox("INBOX", false, (err, box) => {
            if (err) {
               writeLog(err+"line 14");
               return
            }
            // Search unseen emails having “hello world” in their Subject headers
            imap.search(["UNSEEN"], (err1, results) => {
                if (err1) {
                    writeLog(err1+"line 19");
                    return
                }
                try {
                    // const f = imap.fetch(results, { bodies: "TEXT" });
                    const f = imap.fetch(results, {
                        bodies: "", // "[\"HEADER.FIELDS (FROM TO SUBJECT DATE)\", ""]",
                        struct: true
                    });
                    f.on("message", (msg, seqno) => {
                        const prefix = `(#${seqno}) `;
                        msg.on("body", (stream, info) => {
                            simpleParser(stream, (err2, mail) => {
                                if (err2) {
                                    writeLog("Read mail executor error …..", err2);
                                    return
                                    //this.emit(EXECUTOR_EVENTS.STOPPED, { reason: END_REASON.ERROR, error: err2 });
                                }

                                //const fileName = `msg-${seqno}-body.json`;
                                //const fullFilePath = path.join(workspace, dir, fileName);
                                const emailEnvolope = {};
                                emailEnvolope.from = mail.from.text;
                                emailEnvolope.date = mail.date;
                                emailEnvolope.to = mail.to.text;
                                emailEnvolope.subject = mail.subject;
                                emailEnvolope.text = mail.text;
                                emailEnvolope.attachmentsName = [];
                                emailEnvolope.attachmentsContent = [];

                                // write attachments
                                for (let i = 0; i < mail.attachments.length; i++) {
                                    const attachment = mail.attachments[i];
                                    const { filename, content } = attachment;
                                    emailEnvolope.attachmentsName.push(filename);
                                    emailEnvolope.attachmentsContent.push(content);
                                    //fs.writeFileSync(path.join(workspace, dir, filename), attachment.content, "base64"); // take encoding from attachment ?
                                }
                                for (let i = 0; i < emailEnvolope.attachmentsName.length; i++) {
                                    console.log(emailEnvolope.attachmentsName);
                                    console.log(emailEnvolope.attachmentsContent);
                                }

                                writeLog("processing mail done….");

                                //this method will create the JIRA "BUG" isue after reading the email and taking the 
                                //body of the email
                                if(!emailEnvolope.text){
                                    writeLog("email is empty");
                                }else{
                                    jira_bugCreator(emailEnvolope, (jiraError, jiraURL) =>{
                                        if(jiraError){
                                            writeLog(jiraError);
                                            return
                                        }else{
                                            writeLog(jiraURL);
                                            const { slackURLEmitter } = require('../slackURLEmitter/slackURLEmitter');
                                            //this method will send the JIRA url to slack
                                            slackURLEmitter(jiraURL);
                                        }
                                    });
                                }
                            });
                        });
                        msg.once("attributes", (attrs) => {
                            // Mark the above mails as read
                            console.log("email reading status");
                            const { uid } = attrs;
                            imap.addFlags(uid, ["\\Seen"], (err2) => {
                                if (err2) {
                                    writeLog(err2);
                                    return
                                } else {
                                    writeLog("Marked as read!");
                                }
                            });
                        });
                    });

                    f.once("end", () => {
                        imap.end();
                    });
                } catch (errorWhileFetching) {
                    writeLog(errorWhileFetching.message+"line 91");

                    if (errorWhileFetching.message === "Nothing to fetch") {
                        writeLog("no mails fetched, temp directory not created");
                        writeLog("Read mail executor finished …..");
                    // this.emit(EXECUTOR_EVENTS.STOPPED, { reason: END_REASON.COMPLETE });
                        
                        imap.end();
                    }
                    imap.end();
                    //this.emit(EXECUTOR_EVENTS.STOPPED, { reason: END_REASON.ERROR });
                }
            });
        }); // close open mailbox
    }); // close ready
    // if error occurs in connection making


    await imap.once("error", (err) => {
        writeLog(err);
        writeLog("Read mail executor error …..");
        //this.emit(EXECUTOR_EVENTS.STOPPED, { reason: END_REASON.ERROR });
    });
    // Once it ends
    await imap.once("end", () => {
        writeLog("Read mail executor finished …..");
        //this.emit(EXECUTOR_EVENTS.STOPPED, { reason: END_REASON.COMPLETE });
    });
    // initiating connection
    await imap.connect();
}

module.exports = gmailReader ;