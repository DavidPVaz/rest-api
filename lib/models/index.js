const Fs = require('fs');
const Config = require('config');

module.exports = (() =>
    Config.models.modules.reduce(
        (acc, module) => [
            ...acc,
            ...Fs.readdirSync(`${Config.models.path}/${module}`)
                .filter(model => model.endsWith('.js'))
                .map(model => `${module}/${model}`)
        ],
        []
    ))();
