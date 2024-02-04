/*
* Title: Server Initialization
* Description: Server related files
* Author: Wbaidur Rahman
* Date: 3/2/2024
*
*/

// dependencies
const http = require('http');
const  {handleReqRes} = require('../helpers/handleReqRes');
const environment = require('../helpers/environments')
const data = require('./data')
const { sendTwilioSms } = require('../helpers/notification')

// server object - module scaffolding
const server = {};


// create server
server.createServer = () => {
    const createServerVariable = http.createServer(handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening to port number : ${environment.port}`)
    })
}



// start the server
server.init = () => {
    server.createServer();
}

// exports
module.exports = server;
