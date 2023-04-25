'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('mm');
const fs = require('fs');
const getFrameworkPath = require('..').getFrameworkPath;


describe('test/framework.test.js', () => {
  afterEach(mm.restore);

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

  it('should get from absolute path', () => {
    const baseDir = path.join(__dirname, 'fixtures/framework-egg-default');
    const frameworkPath = path.join(baseDir, 'node_modules/egg');
    const framework = getFrameworkPath({
      baseDir,
      framework: frameworkPath,
    });
    assert(framework === frameworkPath);
  });

  it('should get from absolute path but not exist', () => {
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
    try {
      getFrameworkPath({
        baseDir,
        framework: 'noexist',
      });
      throw new Error('should not run');
    } catch (err) {
      const frameworkPaths = [
        path.join(baseDir, 'node_modules'),
        path.join(process.cwd(), 'node_modules'),
      ].join(',');
      assert(err.message === `noexist is not found in ${frameworkPaths}`);
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
      const frameworkPaths = [
        path.join(baseDir, 'node_modules'),
        path.join(process.cwd(), 'node_modules'),
      ].join(',');
      assert(err.message === `noexist is not found in ${frameworkPaths}`);
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
      const frameworkPaths = [
        path.join(baseDir, 'node_modules'),
        path.join(process.cwd(), 'node_modules'),
      ].join(',');
      assert(err.message === `egg is not found in ${frameworkPaths}`);
    }
  });

  it('should get egg from process.cwd', () => {
    const cwd = path.join(__dirname, 'fixtures/test-app');
    mm(process, 'cwd', () => cwd);
    const baseDir = path.join(__dirname, 'fixtures/test-app/test/fixtures/app');

    const framework = getFrameworkPath({
      baseDir,
    });
    assert(framework === path.join(cwd, 'node_modules/egg'));
  });

  it('should get egg from monorepo root dir', () => {
    const cwd = path.join(__dirname, 'fixtures/monorepo-app/packages/a');
    mm(process, 'cwd', () => cwd);
    const linkEgg = path.join(__dirname, '..', 'node_modules/egg');
    fs.symlinkSync(path.join(__dirname, 'fixtures/monorepo-app/node_modules/egg'), linkEgg);
    const framework = getFrameworkPath({
      baseDir: cwd,
    });
    fs.unlinkSync(linkEgg);
    assert(framework === linkEgg);
  });
});
