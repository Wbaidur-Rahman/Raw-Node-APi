/*
* Title: Routes
* Description: For Routing
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/


// dependencies
const {sampleHandler} = require('./handlers/RouteHandlers/sampleHandler.js')

const routes = {
    sample: sampleHandler,

};

module.exports = routes;
