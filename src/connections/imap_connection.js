const {user, password, host, port, tls} = require('../assets/static/gmail_properties');
const { writeLog } = require('../utility/writeLog')

var Imap = require("imap");

console.log(user)

// host gmail
var imap = new Imap({
    user,
    password,
    host,
    port,
    tls
});

writeLog("Starting read mail …..");
module.exports = {imap};