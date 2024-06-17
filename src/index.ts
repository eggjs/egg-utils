import { getFrameworkPath } from './framework.js';
import { getPlugins, getConfig, getLoadUnits } from './plugin.js';
import { getFrameworkOrEggPath } from './deprecated.js';

// support import { getFrameworkPath } from '@eggjs/utils'
export { getFrameworkPath } from './framework.js';
export { getPlugins, getConfig, getLoadUnits } from './plugin.js';
export { getFrameworkOrEggPath } from './deprecated.js';
export * from './import.js';

// support import utils from '@eggjs/utils'
export default {
  getFrameworkPath,
  getPlugins, getConfig, getLoadUnits,
  getFrameworkOrEggPath,
};
