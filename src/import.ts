import { debuglog } from 'node:util';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const debug = debuglog('@eggjs/utils:loader');

let _customRequire: NodeRequire;

export interface ImportResolveOptions {
  paths?: string[];
}

export interface ImportModuleOptions extends ImportResolveOptions {
  // only import export default object
  importDefaultOnly?: boolean;
  // esm only
  esmOnly?: boolean;
}

export function importResolve(filepath: string, options?: ImportResolveOptions) {
  if (!_customRequire) {
    if (typeof require !== 'undefined') {
      _customRequire = require;
    } else {
      _customRequire = createRequire(process.cwd());
    }
  }
  const moduleFilePath = _customRequire.resolve(filepath, options);
  debug('[importResolve] %o, options: %o => %o', filepath, options, moduleFilePath);
  return moduleFilePath;
}

export async function importModule(filepath: string, options?: ImportModuleOptions) {
  const moduleFilePath = importResolve(filepath, options);
  let obj: any;
  if (typeof require === 'function' && options?.esmOnly !== true) {
    // commonjs
    obj = require(moduleFilePath);
    debug('[importModule] require %o => %o', filepath, obj);
    if (obj?.__esModule === true && 'default' in obj) {
      // 兼容 cjs 模拟 esm 的导出格式
      // {
      //   __esModule: true,
      //   default: { fn: [Function: fn], foo: 'bar', one: 1 }
      // }
      obj = obj.default;
    }
  } else {
    // esm
    debug('[importModule] await import start: %o', filepath, typeof require, process.features.require_module);
    const fileUrl = pathToFileURL(moduleFilePath).toString();
    obj = await import(fileUrl);
    debug('[importModule] await import end: %o => %o', filepath, obj);
    // {
    //   default: { foo: 'bar', one: 1 },
    //   foo: 'bar',
    //   one: 1,
    //   [Symbol(Symbol.toStringTag)]: 'Module'
    // }
    if (obj?.default?.__esModule === true && 'default' in obj?.default) {
      // 兼容 cjs 模拟 esm 的导出格式
      // {
      //   __esModule: true,
      //   default: {
      //     __esModule: true,
      //     default: {
      //       fn: [Function: fn] { [length]: 0, [name]: 'fn' },
      //       foo: 'bar',
      //       one: 1
      //     }
      //   },
      //   [Symbol(Symbol.toStringTag)]: 'Module'
      // }
      // 兼容 ts module
      // {
      //   default: {
      //     [__esModule]: true,
      //     default: <ref *1> [Function: default_1] {
      //       [length]: 0,
      //       [name]: 'default_1',
      //       [prototype]: { [constructor]: [Circular *1] }
      //     }
      //   },
      //   [Symbol(Symbol.toStringTag)]: 'Module'
      // }
      obj = obj.default;
    }
    if (options?.importDefaultOnly) {
      if ('default' in obj) {
        obj = obj.default;
      }
    }
  }
  debug('[importModule] return %o => %o', filepath, obj);
  return obj;
}
