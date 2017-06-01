'use strict';

const getLoadUnits = require('../../../index').getLoadUnits;

const units = getLoadUnits(JSON.parse(process.argv[2]));
console.log('get %s plugin', units.filter(p => p.type === 'plugin').length);
console.log('get %s framework', units.filter(p => p.type === 'framework').length);
console.log('get %s app', units.filter(p => p.type === 'app').length);
