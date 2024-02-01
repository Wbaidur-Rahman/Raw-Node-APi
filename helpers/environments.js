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
    envName: 'staging'
};

environments.production = {
    port: 5000,
    envName: 'production'
};

// determine which environment was passed
const currentEnvironment = 
            typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV: 'staging';

// exports corresponding environment object
const environmentToExport = 
            typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;