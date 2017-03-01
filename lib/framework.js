'use strict';

const path = require('path');
const assert = require('assert');
const fs = require('fs');


module.exports = { getFrameworkPath };

/**
 * Find the framework directory, lookup order
 * - specify framework path
 * - get framework name from
 * - use egg by default
 * @param {Object} options - options
 * @param  {String} options.baseDir - the current directory of application
 * @param  {String} [options.framework] - the directory of framework
 * @return {String} frameworkPath
 */
function getFrameworkPath({ framework, baseDir }) {
  const pkgPath = path.join(baseDir, 'package.json');
  assert(fs.existsSync(pkgPath), `${pkgPath} should exist`);

  const moduleDir = path.join(baseDir, 'node_modules');
  const pkg = require(pkgPath);

  // 1. pass framework or customEgg
  if (framework) {
    // 1.1 framework is an absolute path
    // framework: path.join(baseDir, 'node_modules/${frameworkName}')
    if (path.isAbsolute(framework)) return assertAndReturn(framework);
    // 1.2 framework is a npm package that required by application
    // framework: 'frameworkName'
    return assertAndReturn(path.join(moduleDir, framework));
  }

  // 2. framework is not specified
  // 2.1 use framework name from pkg.egg.framework
  if (pkg.egg && pkg.egg.framework) {
    return assertAndReturn(path.join(moduleDir, pkg.egg.framework));
  }

  // 2.2 use egg by default
  return assertAndReturn(path.join(moduleDir, 'egg'));
}

function assertAndReturn(frameworkPath) {
  assert(fs.existsSync(frameworkPath), `${frameworkPath} should exist`);
  return frameworkPath;
}
