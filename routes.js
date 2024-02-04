/*
* Title: Routes
* Description: For Routing
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/


// dependencies
const {sampleHandler} = require('./handlers/RouteHandlers/sampleHandler')
const{userHandler} = require('./handlers/RouteHandlers/userHandler')
const{tokenHandler} = require('./handlers/RouteHandlers/tokenHandler')
const{checkHandler} = require('./handlers/RouteHandlers/checkHandler')

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
