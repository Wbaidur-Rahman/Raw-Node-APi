/*
* Title: Sample Handler
* Description: Sample Handler
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        message: 'This is a sample url'
    })
}

module.exports = handler;
