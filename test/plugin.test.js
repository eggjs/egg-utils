'use strict';

const path = require('path');
// const assert = require('assert');
const mm = require('mm');
const cpy = require('cpy');
const rimraf = require('mz-modules/rimraf');
const coffee = require('coffee');
const runscript = require('runscript');


describe('test/plugin.test.js', () => {
  const cwd = path.join(__dirname, 'fixtures/egg-app');
  const tmp = path.join(__dirname, 'fixtures/tmp');
  afterEach(mm.restore);

  describe('getPlugins', () => {
    const bin = path.join(cwd, 'get_plugin.js');
    beforeEach(() => cpy('**/*', tmp, { cwd }));
    afterEach(() => rimraf(tmp));

    it('should get plugins using npm', function* () {
      yield runscript('npm -v && npm install', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      yield coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get all plugins onerror,session,i18n,watcher,multipart,security,development,logrotator,schedule,static,jsonp,view/)
        .expect('code', 0)
        .end();
    });

    it('should get plugins using npminstall', function* () {
      yield runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      yield coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get all plugins onerror,session,i18n,watcher,multipart,security,development,logrotator,schedule,static,jsonp,view/)
        .expect('code', 0)
        .end();
    });
  });

  describe('getLoadUnits', () => {
    const bin = path.join(cwd, 'get_loadunit.js');
    beforeEach(() => cpy('**/*', tmp, { cwd }));
    afterEach(() => rimraf(tmp));

    it('should get plugins using npm', function* () {
      yield runscript('npm -v && npm install', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      yield coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get 11 plugin/)
        .expect('stdout', /get 1 framework/)
        .expect('stdout', /get 1 app/)
        .expect('code', 0)
        .end();
    });

    it('should get plugins using npminstall', function* () {
      yield runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      yield coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get 11 plugin/)
        .expect('stdout', /get 1 framework/)
        .expect('stdout', /get 1 app/)
        .expect('code', 0)
        .end();
    });

    it('should get plugins when baseDir is not exist', function* () {
      yield runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        framework: path.join(tmp, 'node_modules/egg'),
      });
      yield coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get 11 plugin/)
        .expect('stdout', /get 1 framework/)
        .expect('stdout', /get 1 app/)
        .expect('code', 0)
        .end();
    });

    it('should throw when no framework', function* () {
      yield coffee.fork(bin, [ '{}' ], { cwd: tmp })
        .debug()
        .expect('stderr', /framework is required/)
        .expect('code', 1)
        .end();
    });

    it('should throw when framework is not exist', function* () {
      const args = JSON.stringify({
        framework: '/noexist',
      });
      yield coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stderr', /\/noexist should exist/)
        .expect('code', 1)
        .end();
    });
  });
});
