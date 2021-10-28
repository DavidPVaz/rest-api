module.exports = {
    verbose: true,
    debug: true,
    // shuffle: true,
    coverage: true,
    threshold: 90,
    lint: true,
    assert: '@hapi/code',
    'coverage-path': 'lib',
    'coverage-exclude': ['config'],
    paths: ['test/models', 'test/modules'],
    // TODO: track/fix global leaks
    // __core-js_shared__ -> https://github.com/tgriesser/knex/issues/1720
    // CSS -> https://github.com/glennjones/hapi-swagger/issues/534
    globals: 'core,regeneratorRuntime,_babelPolyfill,__core-js_shared__,CSS'
};
