module.exports = {
    verbose: true,
    debug: true,
    coverage: true,
    threshold: 90,
    lint: true,
    assert: '@hapi/code',
    'coverage-path': 'lib',
    'coverage-exclude': ['config', 'db'],
    paths: ['test/models', 'test/modules'],
    globals:
        'core,regeneratorRuntime,_babelPolyfill,__core-js_shared__,CSS,__extends,__assign,__rest,__decorate,__param,__metadata,__awaiter,__generator,__exportStar,__createBinding,__values,__read,__spread,__spreadArrays,__spreadArray,__await,__asyncGenerator,__asyncDelegator,__asyncValues,__makeTemplateObject,__importStar,__importDefault,__classPrivateFieldGet,__classPrivateFieldSet'
};
