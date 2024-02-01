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

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port number : ${app.config.port}`)
    })
}



// start the server
app.createServer();

