/*
* Title: Utilities
* Description: Important utilis
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

const crypto = require('crypto');
const { type } = require('os');
const environment = require('./environments')

// Module Scaffolding
const Utilities = {};

// parse JSON string to Object
Utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString);
    } catch{
        output = {};
    }

    return output;
}

// hash string
Utilities.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto
        .createHmac('sha256', environment.secretKey)
        .update(str)
        .digest('hex');
        return hash;
    } else {
        return false;
    }
}

// create random string
Utilities.createRandomString = (strlength) => {
    let length = typeof(strlength) === 'number' && strlength > 0
        ? strlength : false;

    if(length) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for(let i=1; i<=length; i+=1){
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
    }else {
        return false;
    }
}

module.exports = Utilities;
