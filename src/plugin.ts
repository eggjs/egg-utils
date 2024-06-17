import { debuglog } from 'node:util';
import path from 'node:path';
import assert from 'node:assert';
import os from 'node:os';
import { stat, mkdir, writeFile, realpath } from 'node:fs/promises';
import { importModule } from './import.js';

const debug = debuglog('@eggjs/utils:plugin');

const tmpDir = os.tmpdir();

function noop() {}

const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

export interface LoaderOptions {
  framework: string;
  baseDir: string;
  env?: string;
}

export interface Plugin {
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
export async function getPlugins(options: LoaderOptions) {
  const loader = await getLoader(options);
  await loader.loadPlugin();
  return loader.allPlugins;
}

interface Unit {
  type: 'plugin' | 'framework' | 'app';
  path: string;
}

/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/egg_loader.js#L348
 */
export async function getLoadUnits(options: LoaderOptions) {
  const loader = await getLoader(options);
  await loader.loadPlugin();
  return loader.getLoadUnits();
}

export async function getConfig(options: LoaderOptions) {
  const loader = await getLoader(options);
  await loader.loadPlugin();
  await loader.loadConfig();
  return loader.config;
}

async function exists(filepath: string) {
  try {
    await stat(filepath);
    return true;
  } catch {
    return false;
  }
}

async function getLoader(options: LoaderOptions) {
  let { framework, baseDir, env } = options;
  assert(framework, 'framework is required');
  assert(await exists(framework), `${framework} should exist`);
  if (!(baseDir && await exists(baseDir))) {
    baseDir = path.join(tmpDir, `egg_utils_${Date.now()}`, 'tmp_app');
    await mkdir(baseDir, { recursive: true });
    await writeFile(path.join(baseDir, 'package.json'), JSON.stringify({
      name: 'tmp_app',
    }));
  }

  const EggLoader = await findEggLoaderImplClass(options);
  const { Application } = await importModule(framework);
  if (env) process.env.EGG_SERVER_ENV = env;
  return new EggLoader({
    baseDir,
    logger,
    app: Object.create(Application.prototype),
  });
}

interface IEggLoader {
  loadPlugin(): Promise<void>;
  loadConfig(): Promise<void>;
  config: Record<string, any>;
  getLoadUnits(): Unit[];
  allPlugins: Record<string, Plugin>;
}

interface IEggLoaderOptions {
  baseDir: string;
  app: unknown;
  logger: object;
}

type EggLoaderImplClass<T = IEggLoader> = new(options: IEggLoaderOptions) => T;

async function findEggLoaderImplClass(options: LoaderOptions): Promise<EggLoaderImplClass> {
  const baseDirRealpath = await realpath(options.baseDir);
  const frameworkRealpath = await realpath(options.framework);
  const paths = [ frameworkRealpath, baseDirRealpath ];
  // custom framework => egg => egg/lib/loader/index.js
  try {
    const { EggLoader } = await importModule('egg', { paths });
    return EggLoader;
  } catch (err: any) {
    debug('[findEggCore] import "egg" from paths:%o error: %o', paths, err);
  }

  const name = '@eggjs/core';
  // egg => egg-core
  try {
    const { EggLoader } = await importModule(name, { paths });
    return EggLoader;
  } catch (err: any) {
    debug('[findEggCore] import "%s" from paths:%o error: %o', name, paths, err);
  }

  try {
    const { EggLoader } = await importModule(name);
    return EggLoader;
  } catch (err: any) {
    debug('[findEggCore] import "%s" error: %o', name, err);
    let eggCorePath = path.join(options.baseDir, `node_modules/${name}`);
    if (!(await exists(eggCorePath))) {
      eggCorePath = path.join(options.framework, `node_modules/${name}`);
    }
    assert(await exists(eggCorePath), `Can't find ${name} from ${options.baseDir} and ${options.framework}`);
    const { EggLoader } = await importModule(eggCorePath);
    return EggLoader;
  }
}
