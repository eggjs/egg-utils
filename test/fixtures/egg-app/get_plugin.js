'use strict';

const getPlugins = require('../../../index').getPlugins;

const plugins = getPlugins(JSON.parse(process.argv[2]));
console.log('get all plugins %s', Object.keys(plugins));
