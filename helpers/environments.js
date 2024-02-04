/*
* Title: Environments
* Description: Handle all environment related things
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'fjhfkjhfkjokjkl',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'AC7e1bc17c6bbf2be2dc3881a7825901cb',
        authToken: '233b1bfcc39651469faf63d0a237f3f0',
        logincode: 'UJ9E2MVBQJXNT3KR35V43LQ4',
    }

};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'jhfdjshifuwieljd',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'AC7e1bc17c6bbf2be2dc3881a7825901cb',
        authToken: '233b1bfcc39651469faf63d0a237f3f0',
        logincode: 'UJ9E2MVBQJXNT3KR35V43LQ4',
    }
};

// determine which environment was passed
const currentEnvironment = 
            typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV: 'staging';

// exports corresponding environment object
const environmentToExport = 
            typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;