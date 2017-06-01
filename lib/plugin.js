'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

exports.getPlugins = opt => {
  const loader = getLoader(opt);
  loader.loadPlugin();
  return loader.allPlugins;
};

exports.getLoadUnits = opt => {
  const loader = getLoader(opt);
  loader.loadPlugin();
  return loader.getLoadUnits();
};

function getLoader({ framework, baseDir }) {
  const { Application } = require(framework);
  const EggLoader = findEggCore({ baseDir, framework }).EggLoader;
  return new EggLoader({
    baseDir,
    logger,
    app: Object.create(Application.prototype),
  });
}

function findEggCore({ baseDir, framework }) {
  try {
    return require('egg-core');
  } catch (_) {
    let eggCorePath = path.join(baseDir, 'node_modules/egg-core');
    if (!fs.existsSync(eggCorePath)) {
      eggCorePath = path.join(framework, 'node_modules/egg-core');
    }
    assert(fs.existsSync(eggCorePath), `Dont find egg-core from ${baseDir} and ${framework}`);
    return require(eggCorePath);
  }
}

function noop() {}
