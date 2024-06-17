import path from 'node:path';
import { strict as assert } from 'node:assert';
import utils from '../src/index.js';
import { getFilepath } from './helper.js';

describe('/test/getFrameworkOrEggPath.test.ts', () => {
  const fixtures = getFilepath('fixtures');

  it('get framework dir path success', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app'));
    assert.equal(dirpath, path.join(fixtures, 'aliyun-egg-app/node_modules/aliyun-egg'));
  });

  it('get custom framework dir path success when app set app.framework on package.json', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'yadan-app'));
    assert.equal(dirpath, path.join(fixtures, 'yadan-app/node_modules/yadan'));
  });

  it('get custom egg dir path success', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app'), [ 'my-old-egg', 'my-new-egg' ]);
    assert.equal(dirpath, path.join(fixtures, 'aliyun-egg-app/node_modules/my-new-egg'));
  });

  it('get default egg dir path success', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'default-egg-app'));
    assert.equal(dirpath, path.join(fixtures, 'default-egg-app/node_modules/egg'));
  });

  it('get "" when egg name not found', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app'), [ 'my-egg' ]);
    assert.equal(dirpath, '');
  });

  it('get "" when node_modules not found', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app-not-exists'));
    assert.equal(dirpath, '');
  });

  it('get "" when framework package.json not exists', () => {
    const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'demoframework-app'));
    assert.equal(dirpath, '');
  });
});
