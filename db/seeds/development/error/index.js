const Chalk = require('chalk');

const internals = {};

internals.initialMessage = `\n${Chalk.redBright(
    'You have a foreign key constraint error!'
)} \n${Chalk.yellow(
    'Please fix the following relationships and execute the database reset again'
)}:\n\n`;

/**
 * Confirm the outcome of foreign key integrity evaluation
 * @param {Array<Object>|[]} result the result of foreign key evaluation
 * @throws {Error} the error with custom message
 */
exports.confirmForeignKeysIntegrityResult = result => {
    if (result.length === 0) {
        return;
    }

    const message = result
        .reduce(
            (message, error) => [
                ...message,
                `-> ${Chalk.yellow(error.table)}'s foreign key relation to ${Chalk.yellow(
                    error.parent
                )} table on row nº ${error.rowid}\n`
            ],
            [internals.initialMessage]
        )
        .join('');

    throw Error(message);
};
