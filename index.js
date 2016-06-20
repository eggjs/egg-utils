'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Try to get framework dir path
 * If can't find any framework, try to find egg dir path
 *
 * @param {String} cwd - current work path
 * @param {Array} [eggNames] - egg names, default is ['egg']
 * @return {String} framework or egg dir path
 */
exports.getFrameworkOrEggPath = function(cwd, eggNames) {
  eggNames = eggNames || ['egg'];
  const moduleDir = path.join(cwd, 'node_modules');
  if (!fs.existsSync(moduleDir)) {
    return '';
  }

  // try to get framework
  const names = fs.readdirSync(moduleDir);
  for (const name of names) {
    const pkgfile = path.join(moduleDir, name, 'package.json');
    if (!fs.existsSync(pkgfile)) {
      continue;
    }
    const pkg = require(pkgfile);
    if (pkg.dependencies) {
      for (const eggName of eggNames) {
        if (pkg.dependencies[eggName]) {
          return path.join(moduleDir, name);
        }
      }
    }
  }

  // try to get egg
  for (const eggName of eggNames) {
    const pkgfile = path.join(moduleDir, eggName, 'package.json');
    if (fs.existsSync(pkgfile)) {
      return path.join(moduleDir, eggName);
    }
  }

  return '';
};
