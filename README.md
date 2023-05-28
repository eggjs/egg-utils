# @eggjs/utils

[![NPM version][npm-image]][npm-url]
[![CI](https://github.com/eggjs/egg-utils/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eggjs/egg-utils/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-utils.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-utils
[codecov-image]: https://codecov.io/github/eggjs/egg-utils/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/eggjs/egg-utils?branch=master
[download-image]: https://img.shields.io/npm/dm/egg-utils.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-utils

Utils for all egg projects.

## Installation

```bash
npm i egg-utils
```

## API

### `getPlugins(options)`

- {String} baseDir - the current directory of application
- {String} framework - the directory of framework
- {String} env - egg environment

### `getLoadUnits(options)`

- {String} baseDir - the current directory of application
- {String} framework - the directory of framework
- {String} env - egg environment

### `getConfig(options)`

- {String} baseDir - the current directory of application
- {String} framework - the directory of framework
- {String} env - egg environment

### `getFrameworkPath(options)`

- {String} baseDir - the current directory of application
- {String} framework - the directory of framework

## License

[MIT](LICENSE)
