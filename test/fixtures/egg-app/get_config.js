'use strict';

const getConfig = require('../../../index').getConfig;

const configs = getConfig(JSON.parse(process.argv[2]));
console.log(process.argv[2]);
console.log('get app configs %s', Object.keys(configs));
