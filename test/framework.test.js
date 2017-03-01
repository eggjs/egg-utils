'use strict';

const path = require('path');
const assert = require('assert');
const getFrameworkPath = require('..').getFrameworkPath;


describe('test/framework.test.js', () => {

  it('should exist when specify baseDir', () => {
    it('should get egg by default but not exist', () => {
      const baseDir = path.join(__dirname, 'noexist');
      try {
        getFrameworkPath({
          baseDir,
        });
        throw new Error('should not run');
      } catch (err) {
        assert(err.message === `${path.join(baseDir, 'package.json')} should exist`);
      }
    });
  });

  it('should get from absolite path', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default');
    const frameworkPath = path.join(baseDir, 'node_modules/egg');
    const framework = getFrameworkPath({
      baseDir,
      framework: frameworkPath,
    });
    assert(framework === frameworkPath);
  });

  it('should get from absolite path but not exist', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default');
    const frameworkPath = path.join(__dirname, 'noexist');
    try {
      getFrameworkPath({
        baseDir,
        framework: frameworkPath,
      });
      throw new Error('should not run');
    } catch (err) {
      assert(err.message === `${frameworkPath} should exist`);
    }
  });

  it('should get from npm package', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default');
    const frameworkPath = path.join(baseDir, 'node_modules/egg');
    const framework = getFrameworkPath({
      baseDir,
      framework: 'egg',
    });
    assert(framework === frameworkPath);
  });

  it('should get from npm package but not exist', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default');
    const frameworkPath = path.join(baseDir, 'node_modules/noexist');
    try {
      getFrameworkPath({
        baseDir,
        framework: 'noexist',
      });
      throw new Error('should not run');
    } catch (err) {
      assert(err.message === `${frameworkPath} should exist`);
    }
  });

  it('should get from pkg.egg.framework', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-pkg-egg');
    const framework = getFrameworkPath({
      baseDir,
    });
    assert(framework === path.join(baseDir, 'node_modules/yadan'));
  });

  it('should get from pkg.egg.framework but not exist', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-pkg-egg-noexist');
    try {
      getFrameworkPath({
        baseDir,
      });
      throw new Error('should not run');
    } catch (err) {
      const frameworkPath = path.join(baseDir, 'node_modules/noexist');
      assert(err.message === `${frameworkPath} should exist`);
    }
  });

  it('should get egg by default', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default');
    const framework = getFrameworkPath({
      baseDir,
    });
    assert(framework === path.join(baseDir, 'node_modules/egg'));
  });

  it('should get egg by default but not exist', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default-noexist');
    try {
      getFrameworkPath({
        baseDir,
      });
      throw new Error('should not run');
    } catch (err) {
      const frameworkPath = path.join(baseDir, 'node_modules/egg');
      assert(err.message === `${frameworkPath} should exist`);
    }
  });
});
