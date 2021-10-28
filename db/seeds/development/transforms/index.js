const { add, sub, formatISO } = require('date-fns');

const internals = {};

internals.interpolationExpression = new RegExp(/\${(?<transform>.+)}/);
internals.removeExtraDoubleQuotes = value => value.replace(/["']+/g, '');
internals.getTransform = value => {
    const transformCode = value.match(internals.interpolationExpression).groups.transform;
    const transformName = transformCode.slice(0, transformCode.indexOf('('));
    const transformArguments = transformCode
        .slice(transformCode.indexOf('(') + 1, transformCode.indexOf(')'))
        .split(',')
        .map(argument => argument.trim())
        .map(internals.removeExtraDoubleQuotes);

    return [transformName, transformArguments];
};

// Holds every possible transformation to perform on a table's attribute
internals.transforms = {
    toRelativeDate: (amount, unit) => formatISO(add(new Date(), { [unit]: amount })),
    today: () => formatISO(new Date()),
    toRelativePastDate: (amount, unit) => formatISO(sub(new Date(), { [unit]: amount }))
};

/**
 * Evaluates wether or not a table attribute needs interpolation
 * @param {String} value the current database table attribute being parsed from the csv file
 * @returns {boolean} the result of the evaluation
 */
exports.needsInterpolation = value => !!value.match(internals.interpolationExpression);

/**
 * Check if the transformation required in a table attribute is a valid transformation
 * @param {String} value the current database table attribute being parsed from the csv file
 * @returns {boolean} the result of the evaluation
 */
exports.isTransformationAvailable = value => {
    const [transformName] = internals.getTransform(value);
    return !!internals.transforms[transformName];
};

/**
 * Perform a transformation on the table attribute value
 * @param {String} value the current database table attribute being parsed from the csv file
 * @returns {String} the result of the transformation
 */
exports.performTransformation = value => {
    const [transformName, transformArguments] = internals.getTransform(value);
    return internals.transforms[transformName](...transformArguments);
};
