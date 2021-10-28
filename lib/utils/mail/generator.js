/**
 * @module MailGenerator
 *
 * @file Creates a Mail Generator instance.
 *
 * {@link https://github.com/eladnava/mailgen}
 */
const Mailgen = require('mailgen');

module.exports = new Mailgen({
    theme: 'cerberus',
    product: {
        name: 'RESTful API',
        link: 'https://github.com/DavidPVaz',
        copyright: 'Copyright © 2020 David Vaz'
    }
});
