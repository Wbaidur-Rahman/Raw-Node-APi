/*
* Title: Project initial file
* Description: Initial code to start the server
* Author: Wbaidur Rahman
* Date: 3/2/2024
*
*/

// dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

// app object - module scaffolding
const app = {};


app.init = () => {
    // start the server
    server.init();
    // start the workers
    workers.init();
};

app.init();

// export the app
module.exports = app;

