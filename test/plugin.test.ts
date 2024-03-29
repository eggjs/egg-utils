import path from 'node:path';
import { strict as assert } from 'node:assert';
import { rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import mm from 'mm';
import coffee from 'coffee';
import runscript from 'runscript';
import utils from '../src';

describe('test/plugin.test.ts', () => {
  const cwd = path.join(__dirname, 'fixtures/egg-app');
  const tmp = path.join(__dirname, 'fixtures/tmp');

  beforeEach(async () => {
    await rm(tmp, { force: true, recursive: true });
    await cp(cwd, tmp, { force: true, recursive: true });
    assert(existsSync(tmp), `${tmp} not exists`);
  });
  afterEach(() => rm(tmp, { force: true, recursive: true }));
  afterEach(mm.restore);

  describe('getPlugins()', () => {
    const bin = path.join(cwd, 'get_plugin.js');
    it('should get plugins using npm', async () => {
      await runscript('npm -v && npm install', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        // .expect('stdout', 'get all plugins onerror,session,i18n,watcher,multipart,security,development,logrotator,schedule,static,jsonp,view\n')
        .expect('stdout', /get all plugins/)
        .expect('code', 0)
        .end();
    });

    it('should get plugins using npminstall', async () => {
      await runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        // .expect('stdout', 'get all plugins onerror,session,i18n,watcher,multipart,security,development,logrotator,schedule,static,jsonp,view\n')
        .expect('stdout', /get all plugins/)
        .expect('code', 0)
        .end();
    });

    it('should get plugins using npminstall on test', async () => {
      await runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
        env: 'test',
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        // .expect('stdout', 'get all plugins onerror,session,i18n,watcher,multipart,security,development,logrotator,schedule,static,jsonp,view,p\n')
        .expect('stdout', /get all plugins/)
        .expect('code', 0)
        .end();
      const plugins = utils.getPlugins({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      assert(Object.keys(plugins).length > 0);
      // console.log(plugins);
      assert.equal(plugins.session.name, 'session');
    });
  });

  describe('getLoadUnits()', () => {
    const bin = path.join(cwd, 'get_loadunit.js');
    it('should get plugins using npm', async () => {
      await runscript('npm -v && npm install', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get 11 plugin/)
        .expect('stdout', /get 1 framework/)
        .expect('stdout', /get 1 app/)
        .expect('code', 0)
        .end();
    });

    it('should get plugins using npminstall', async () => {
      await runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get 11 plugin/)
        .expect('stdout', /get 1 framework/)
        .expect('stdout', /get 1 app/)
        .expect('code', 0)
        .end();
      const units = utils.getLoadUnits({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      assert(units.length > 0);
      // console.log(units);
      assert.equal(units[0].type, 'plugin');
    });

    it('should get plugins when baseDir is not exist', async () => {
      await runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stdout', /get 11 plugin/)
        .expect('stdout', /get 1 framework/)
        .expect('stdout', /get 1 app/)
        .expect('code', 0)
        .end();
    });

    it('should throw when no framework', async () => {
      await coffee.fork(bin, [ '{}' ], { cwd: tmp })
        .debug()
        .expect('stderr', /framework is required/)
        .expect('code', 1)
        .end();
    });

    it('should throw when framework is not exist', async () => {
      const args = JSON.stringify({
        framework: '/noexist',
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        .expect('stderr', /\/noexist should exist/)
        .expect('code', 1)
        .end();
    });
  });

  describe('getConfig()', () => {
    const bin = path.join(tmp, 'get_config.js');
    it('should get configs using npm', async () => {
      await runscript('npm -v && npm install', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        // .expect('stdout', /get app configs session,security,helper,jsonp,onerror,i18n,watcher,multipart,logrotator,static,view,env,name,keys,proxy,protocolHeaders,ipHeaders,hostHeaders,pkg,baseDir,HOME,rundir,dump,notfound,siteFile,bodyParser,logger,httpclient,coreMiddleware,workerStartTimeout,coreMiddlewares,appMiddlewares,appMiddleware/)
        .expect('stdout', /get app configs/)
        .expect('code', 0)
        .end();
    });

    it('should get configs using npminstall on framework = egg', async () => {
      await runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/egg'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        // .expect('stdout', /get app configs session,security,helper,jsonp,onerror,i18n,watcher,multipart,logrotator,static,view,env,name,keys,proxy,protocolHeaders,ipHeaders,hostHeaders,pkg,baseDir,HOME,rundir,dump,notfound,siteFile,bodyParser,logger,httpclient,coreMiddleware,workerStartTimeout,coreMiddlewares,appMiddlewares,appMiddleware/)
        .expect('stdout', /get app configs/)
        .expect('code', 0)
        .end();
    });

    it('should get configs using npminstall on framework = custom egg', async () => {
      await runscript('npminstall', { cwd: tmp });

      const args = JSON.stringify({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/framework-demo'),
      });
      await coffee.fork(bin, [ args ], { cwd: tmp })
        .debug()
        // .expect('stdout', /get app configs session,security,helper,jsonp,onerror,i18n,watcher,multipart,logrotator,static,view,env,name,keys,proxy,protocolHeaders,ipHeaders,hostHeaders,pkg,baseDir,HOME,rundir,dump,notfound,siteFile,bodyParser,logger,httpclient,coreMiddleware,workerStartTimeout,coreMiddlewares,appMiddlewares,appMiddleware/)
        .expect('stdout', /get app configs/)
        .expect('code', 0)
        .end();
      const config = utils.getConfig({
        baseDir: tmp,
        framework: path.join(tmp, 'node_modules/framework-demo'),
      });
      assert(config);
      assert.equal(config.name, 'egg-app');
    });
  });
});
