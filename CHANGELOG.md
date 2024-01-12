# Changelog

## [3.0.1](https://github.com/eggjs/egg-utils/compare/v3.0.0...v3.0.1) (2024-01-12)


### Bug Fixes

* scope package resolve logic in monorepo ([#20](https://github.com/eggjs/egg-utils/issues/20)) ([f4a47b9](https://github.com/eggjs/egg-utils/commit/f4a47b908120049094b7689ec51c8c6de1066f96))

## [3.0.0](https://github.com/eggjs/egg-utils/compare/v2.5.0...v3.0.0) (2023-05-29)


### ⚠ BREAKING CHANGES

* drop Node.js 14 support

closes https://github.com/eggjs/egg-utils/issues/18

### Features

* refactor with typescript ([#19](https://github.com/eggjs/egg-utils/issues/19)) ([7f6dcf5](https://github.com/eggjs/egg-utils/commit/7f6dcf5a58f6b3d7801082fb9f8c363e19763b55))

## [2.5.0](https://github.com/eggjs/egg-utils/compare/v2.4.1...v2.5.0) (2023-04-26)


### Features

* getFrameworkPath support monorepo ([#16](https://github.com/eggjs/egg-utils/issues/16)) ([47ffc89](https://github.com/eggjs/egg-utils/commit/47ffc89fa01636e30761068539296e4786093ab1))


---

2.4.1 / 2018-08-07
==================

**fixes**
  * [[`413d47b`](http://github.com/eggjs/egg-utils/commit/413d47b23281e226a6bd6da76d78047214f8b64d)] - fix: not loading plugins config while getting configs (#12) (Khaidi Chu <<i@2333.moe>>)

2.4.0 / 2018-04-15
==================

**features**
  * [[`737c851`](http://github.com/eggjs/egg-utils/commit/737c851272f1d50a103158d52359b536bc33f893)] - feat: env options for all utils (#10) (Haoliang Gao <<sakura9515@gmail.com>>)
  * [[`99877f4`](http://github.com/eggjs/egg-utils/commit/99877f49941bb41cff49f692e75382bdb651cb07)] - feat: add getConfig (#9) (Kaicong Huang <<526672351@qq.com>>)

**others**
  * [[`6c37dd2`](http://github.com/eggjs/egg-utils/commit/6c37dd22ed653dfb21df218a270e0b83d3825e75)] - docs: fix readme (#11) (Haoliang Gao <<sakura9515@gmail.com>>)

2.3.0 / 2017-10-26
==================

**others**
  * [[`42e4394`](http://github.com/eggjs/egg-utils/commit/42e43949997a98c1caacddced05ad8f307cbe1ca)] - refactor: use readJSON instead of require (#8) (Haoliang Gao <<sakura9515@gmail.com>>)

2.2.0 / 2017-06-02
==================

  * feat: check baseDir and framework (#7)
  * feat: add getPlugins and getLoadUnits (#6)

2.1.0 / 2017-03-02
==================

  * feat: lookup framework from process.cwd() (#4)

2.0.0 / 2017-03-01
==================

  * feat: move getFrameworkPath from egg-cluster (#2)
  * deps: only support node >= 6.0.0

1.1.0 / 2017-01-13
==================

  * feat: support read framework from package.json (#1)

1.0.0 / 2016-06-20
==================

  * init version
