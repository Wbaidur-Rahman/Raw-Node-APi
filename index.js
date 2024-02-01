/*
* Title: Uptime Monitoring Application
* Description: A RESTFul API to minitor up or down time of user defined links
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

// dependencies
const http = require('http');
const  {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments')


// app object - module scaffolding
const app = {};


// create server
app.createServer = () => {
    const server = http.createServer(handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port number : ${environment.port}`)
    })
}



// start the server
app.createServer();

