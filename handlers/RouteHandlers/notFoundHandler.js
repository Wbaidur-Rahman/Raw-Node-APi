/*
* Title: Not Found Handler
* Description: If requested url not found
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {

    callback(404, {
        message: 'Your requested url is not found',
    })
};

module.exports = handler;
