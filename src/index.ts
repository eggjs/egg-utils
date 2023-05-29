import { getFrameworkPath } from './framework';
import { getPlugins, getConfig, getLoadUnits } from './plugin';
import { getFrameworkOrEggPath } from './deprecated';

// support import { getFrameworkPath } from '@eggjs/utils'
export { getFrameworkPath } from './framework';
export { getPlugins, getConfig, getLoadUnits } from './plugin';
export { getFrameworkOrEggPath } from './deprecated';

// support import utils from '@eggjs/utils'
export default {
  getFrameworkPath,
  getPlugins, getConfig, getLoadUnits,
  getFrameworkOrEggPath,
};
