# [1.21.0](https://github.com/mittwald/cli/compare/v1.20.3...v1.21.0) (2026-07-21)


### Bug Fixes

* **database:** adapt MySQL user update to @mittwald/api-client 4.420 ([#2020](https://github.com/mittwald/cli/issues/2020)) ([d1980b9](https://github.com/mittwald/cli/commit/d1980b97dec4d9ea9100d5cc1884033abb03ad04)), closes [#2017](https://github.com/mittwald/cli/issues/2017)


### Features

* **app:** add commands to link, unlink and replace an app's database ([#1971](https://github.com/mittwald/cli/issues/1971)) ([20bbbcd](https://github.com/mittwald/cli/commit/20bbbcd4650123ac528666dd5f16f4db4c7ac7cc)), closes [#1969](https://github.com/mittwald/cli/issues/1969)
* **database:** add "database mysql upgrade" command ([#2005](https://github.com/mittwald/cli/issues/2005)) ([1265923](https://github.com/mittwald/cli/commit/1265923076703c43aad4060624081cee1ed0ee08))
* **deploy:** build and push early exit for experimental deploy ([#2021](https://github.com/mittwald/cli/issues/2021)) ([225c8e0](https://github.com/mittwald/cli/commit/225c8e053f6345cfe320248fac141105ea03a9e0)), closes [#1990](https://github.com/mittwald/cli/issues/1990)

## [1.20.3](https://github.com/mittwald/cli/compare/v1.20.2...v1.20.3) (2026-07-16)


### Bug Fixes

* **database:** report the actual database status in list commands ([#2006](https://github.com/mittwald/cli/issues/2006)) ([2b17ba6](https://github.com/mittwald/cli/commit/2b17ba67690880cb50f823e9e49a777328cb43ec)), closes [#2005](https://github.com/mittwald/cli/issues/2005)

## [1.20.2](https://github.com/mittwald/cli/compare/v1.20.1...v1.20.2) (2026-07-07)


### Bug Fixes

* **project:** handle thrown 403 for inaccessible customer in project get ([#1988](https://github.com/mittwald/cli/issues/1988)) ([99f21a7](https://github.com/mittwald/cli/commit/99f21a733e27a1ab9d6f216fb8a43e430abf178e)), closes [#1956](https://github.com/mittwald/cli/issues/1956) [#1955](https://github.com/mittwald/cli/issues/1955)

## [1.20.1](https://github.com/mittwald/cli/compare/v1.20.0...v1.20.1) (2026-07-03)


### Bug Fixes

* **cronjob:** include container (service) cronjobs in list ([#1981](https://github.com/mittwald/cli/issues/1981)) ([5c03091](https://github.com/mittwald/cli/commit/5c03091fd2083416716180b48c86580bb36c3153)), closes [#1980](https://github.com/mittwald/cli/issues/1980)
* **cronjob:** render container cron jobs in "cronjob get" ([#1982](https://github.com/mittwald/cli/issues/1982)) ([97f5475](https://github.com/mittwald/cli/commit/97f5475982179aee8ffa3f478219ae95731dd289)), closes [#1981](https://github.com/mittwald/cli/issues/1981)
* **release:** do not specify model explicitly when announcing release ([b21740f](https://github.com/mittwald/cli/commit/b21740f1cd95e99671ae30630ec6accb140790f8))

# [1.20.0](https://github.com/mittwald/cli/compare/v1.19.0...v1.20.0) (2026-07-02)


### Features

* **domain:** add command to update a virtual host's paths ([#1953](https://github.com/mittwald/cli/issues/1953)) ([996c5be](https://github.com/mittwald/cli/commit/996c5be0d66eee700d228351b1a54530167b6fe9))

# [1.19.0](https://github.com/mittwald/cli/compare/v1.18.0...v1.19.0) (2026-07-01)


### Bug Fixes

* **project:** handle inaccessible customer in project get ([#1956](https://github.com/mittwald/cli/issues/1956)) ([203a95b](https://github.com/mittwald/cli/commit/203a95b9765d3d1ac8d85dc13ac2c38ab703c014))


### Features

* **app:** allow pinning system-software versions on app create ([#1954](https://github.com/mittwald/cli/issues/1954)) ([5bd527b](https://github.com/mittwald/cli/commit/5bd527b95d8f2ff0310256f61753d8bb8b9e2e1e))
* **experimental/deploy:** make image and service name configurable ([#1962](https://github.com/mittwald/cli/issues/1962)) ([47ba831](https://github.com/mittwald/cli/commit/47ba8310baaac8743c03fc5fb6179574a10256a4)), closes [#1960](https://github.com/mittwald/cli/issues/1960)

# [1.18.0](https://github.com/mittwald/cli/compare/v1.17.2...v1.18.0) (2026-06-25)


### Bug Fixes

* **release:** formatting in release.config.cjs ([7aad175](https://github.com/mittwald/cli/commit/7aad175e95f244c35213a4c84a6874f38b16ca88))


### Features

* **stack:** add stack set-update-schedule and stack unset-update-schedule commands ([#1938](https://github.com/mittwald/cli/issues/1938)) ([d58f217](https://github.com/mittwald/cli/commit/d58f21748731bec1ace57048437beccbc4801f44))
* **stack:** show update schedule in stack list ([#1939](https://github.com/mittwald/cli/issues/1939)) ([a5d990d](https://github.com/mittwald/cli/commit/a5d990dc91f2666006c7009827ee227026db4f07))

## [1.17.2](https://github.com/mittwald/cli/compare/v1.17.1...v1.17.2) (2026-06-03)


### Bug Fixes

* **domain/virtualhost:** keep colons in --path-to-url values ([#1880](https://github.com/mittwald/cli/issues/1880)) ([2e30d12](https://github.com/mittwald/cli/commit/2e30d1272413847850dbec9eb5d6670834c968db))

## [1.17.1](https://github.com/mittwald/cli/compare/v1.17.0...v1.17.1) (2026-06-01)


### Bug Fixes

* resolve hanging tight loop on windows ([#1873](https://github.com/mittwald/cli/issues/1873)) ([b863a5b](https://github.com/mittwald/cli/commit/b863a5ba2b6eb2d35fdd42befb6558bad7910de0))
* work around broken log API endpoint by ignoring RST_STREAM data frames ([#1877](https://github.com/mittwald/cli/issues/1877)) ([8844603](https://github.com/mittwald/cli/commit/884460359d485a49990eb6c6c68439427d9178b1)), closes [#1677](https://github.com/mittwald/cli/issues/1677) [#1677](https://github.com/mittwald/cli/issues/1677)

# [1.17.0](https://github.com/mittwald/cli/compare/v1.16.2...v1.17.0) (2026-05-20)


### Features

* **deploy:** add experimental zero-config deploy command ([#1705](https://github.com/mittwald/cli/issues/1705)) ([25a0da9](https://github.com/mittwald/cli/commit/25a0da9eff64409e961154111342972f7dc57392))

## [1.16.2](https://github.com/mittwald/cli/compare/v1.16.1...v1.16.2) (2026-05-20)


### Bug Fixes

* **ci:** use relative paths for artifact download target ([#1848](https://github.com/mittwald/cli/issues/1848)) ([3457963](https://github.com/mittwald/cli/commit/3457963038d2c5f335b3a1b17dd1423fe2d362fa))

## [1.16.1](https://github.com/mittwald/cli/compare/v1.16.0...v1.16.1) (2026-05-19)


### Bug Fixes

* **ci:** fix build pipeline for Homebrew and Docker releases ([#1846](https://github.com/mittwald/cli/issues/1846)) ([10e1718](https://github.com/mittwald/cli/commit/10e171872a47ea924d1ae01d4d795c38dd2e4e9a))

# [1.16.0](https://github.com/mittwald/cli/compare/v1.15.0...v1.16.0) (2026-05-11)


### Features

* **stack:** add `-ojson` and `--quiet` machine-readable output to `stack deploy` ([#1796](https://github.com/mittwald/cli/issues/1796)) ([431f1ea](https://github.com/mittwald/cli/commit/431f1ea78fb575b5b8b1f890140c8af6d2abab2c)), closes [#1788](https://github.com/mittwald/cli/issues/1788)

# [1.15.0](https://github.com/mittwald/cli/compare/v1.14.0...v1.15.0) (2026-04-13)


### Features

* **stack:** warn about container deletion during stack deploy ([#1755](https://github.com/mittwald/cli/issues/1755)) ([8e3e6e6](https://github.com/mittwald/cli/commit/8e3e6e6a9e8ed632becaac17697b253784fad1fc)), closes [#1400](https://github.com/mittwald/cli/issues/1400)

# [1.14.0](https://github.com/mittwald/cli/compare/v1.13.4...v1.14.0) (2026-03-30)


### Features

* Add DotfileContextProvider (.mw-context.json) ([#1734](https://github.com/mittwald/cli/issues/1734)) ([4129200](https://github.com/mittwald/cli/commit/41292007e6cecc9874e01a15b6b95dd218eac333))

## [1.13.4](https://github.com/mittwald/cli/compare/v1.13.3...v1.13.4) (2026-03-12)


### Bug Fixes

* **ddev:** handle PHP extended support versions in `mw ddev init` ([#1696](https://github.com/mittwald/cli/issues/1696)) ([0325053](https://github.com/mittwald/cli/commit/032505322bd0c06707e4fd1570bcca88236cc43c)), closes [mittwald/cli#1695](https://github.com/mittwald/cli/issues/1695)
* **ssh:** embed known host keys for mittwald clusters ([#1667](https://github.com/mittwald/cli/issues/1667)) ([1ab2917](https://github.com/mittwald/cli/commit/1ab2917eaa98d095c39338c8cd2154d68fab0443)), closes [#1260](https://github.com/mittwald/cli/issues/1260)

## [1.13.3](https://github.com/mittwald/cli/compare/v1.13.2...v1.13.3) (2026-02-17)


### Bug Fixes

* **stack:** clarify wording in container update docstring ([#1662](https://github.com/mittwald/cli/issues/1662)) ([d31a3f0](https://github.com/mittwald/cli/commit/d31a3f0ded2e54d8b2e0d762880d8dd1f7974c30))
