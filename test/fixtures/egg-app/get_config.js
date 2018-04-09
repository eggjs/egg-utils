'use strict';

const getConfig = require('../../../index').getConfig;

const config = getConfig(JSON.parse(process.argv[2]));
console.log('get app config %s', Object.keys(config));
