const { knexSnakeCaseMappers } = require('objection');

const { wrapIdentifier, postProcessResponse } = knexSnakeCaseMappers();

exports.useMappers = function () {
    let mappersAreActive = true;

    const dummyWrapIdentifier = (value, origImpl) => origImpl(value);
    const dummyPostProcessResponse = result => result;

    return {
        wrapIdentifier: (...args) =>
            mappersAreActive ? wrapIdentifier(...args) : dummyWrapIdentifier(...args),
        postProcessResponse: (...args) =>
            mappersAreActive ? postProcessResponse(...args) : dummyPostProcessResponse(...args),
        activateMappers: () => (mappersAreActive = true),
        deactivateMappers: () => (mappersAreActive = false)
    };
};
