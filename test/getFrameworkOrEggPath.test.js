'use strict';

const test = require('ava');
const path = require('path');
const utils = require('..');

const fixtures = path.join(__dirname, 'fixtures');

test('get framework dir path success', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app'));
  t.is(dirpath, path.join(fixtures, 'aliyun-egg-app/node_modules/aliyun-egg'));
});

test('get custom framework dir path success when app set app.framework on package.json', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'yadan-app'));
  t.is(dirpath, path.join(fixtures, 'yadan-app/node_modules/yadan'));
});

test('get custom egg dir path success', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app'), [ 'my-old-egg', 'my-new-egg' ]);
  t.is(dirpath, path.join(fixtures, 'aliyun-egg-app/node_modules/my-new-egg'));
});

test('get default egg dir path success', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'default-egg-app'));
  t.is(dirpath, path.join(fixtures, 'default-egg-app/node_modules/egg'));
});

test('get "" when egg name not found', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app'), [ 'my-egg' ]);
  t.is(dirpath, '');
});

test('get "" when node_modules not found', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'aliyun-egg-app-not-exists'));
  t.is(dirpath, '');
});

test('get "" when framework package.json not exists', t => {
  const dirpath = utils.getFrameworkOrEggPath(path.join(fixtures, 'demoframework-app'));
  t.is(dirpath, '');
});
