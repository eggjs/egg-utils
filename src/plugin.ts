/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'node:path';
import assert from 'node:assert';
import os from 'node:os';
import { existsSync, mkdirSync, writeFileSync, realpathSync } from 'node:fs';

const tmpDir = os.tmpdir();
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

interface LoaderOptions {
  framework: string;
  baseDir: string;
  env?: string;
}

interface Plugin {
  name: string;
  version?: string;
  enable: boolean;
  implicitEnable: boolean;
  path: string;
  dependencies: string[];
  optionalDependencies: string[];
  env: string[];
  from: string;
}

/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/mixin/plugin.js#L203
 */
export function getPlugins(options: LoaderOptions) {
  const loader = getLoader(options);
  loader.loadPlugin();
  return loader.allPlugins;
}

interface Unit {
  type: 'plugin' | 'framework' | 'app';
  path: string;
}

/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/egg_loader.js#L348
 */
export function getLoadUnits(options: LoaderOptions) {
  const loader = getLoader(options);
  loader.loadPlugin();
  return loader.getLoadUnits();
}

export function getConfig(options: LoaderOptions) {
  const loader = getLoader(options);
  loader.loadPlugin();
  loader.loadConfig();
  return loader.config;
}

function getLoader(options: LoaderOptions) {
  let { framework, baseDir, env } = options;
  assert(framework, 'framework is required');
  assert(existsSync(framework), `${framework} should exist`);
  if (!(baseDir && existsSync(baseDir))) {
    baseDir = path.join(tmpDir, String(Date.now()), 'tmpapp');
    mkdirSync(baseDir, { recursive: true });
    writeFileSync(path.join(baseDir, 'package.json'), JSON.stringify({ name: 'tmpapp' }));
  }

  const EggLoader = findEggCore({ baseDir, framework });
  const { Application } = require(framework);
  if (env) process.env.EGG_SERVER_ENV = env;
  return new EggLoader({
    baseDir,
    logger,
    app: Object.create(Application.prototype),
  });
}

interface Loader {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new(...args: any): Loader;
  loadPlugin(): void;
  loadConfig(): void;
  config: Record<string, any>;
  getLoadUnits(): Unit[];
  allPlugins: Record<string, Plugin>;
}

function findEggCore({ baseDir, framework }): Loader {
  const baseDirRealpath = realpathSync(baseDir);
  const frameworkRealpath = realpathSync(framework);
  // custom framework => egg => egg/lib/loader/index.js
  try {
    return require(require.resolve('egg/lib/loader', {
      paths: [ frameworkRealpath, baseDirRealpath ],
    })).EggLoader;
  } catch {
    // ignore
  }

  const name = 'egg-core';
  // egg => egg-core
  try {
    return require(require.resolve(name, {
      paths: [ frameworkRealpath, baseDirRealpath ],
    })).EggLoader;
  } catch {
    // ignore
  }

  try {
    return require(name).EggLoader;
  } catch {
    let eggCorePath = path.join(baseDir, `node_modules/${name}`);
    if (!existsSync(eggCorePath)) {
      eggCorePath = path.join(framework, `node_modules/${name}`);
    }
    assert(existsSync(eggCorePath), `Can't find ${name} from ${baseDir} and ${framework}`);
    return require(eggCorePath).EggLoader;
  }
}
