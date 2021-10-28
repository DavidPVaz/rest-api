/**
 * @module Plugins
 * @file Gathers all Plugins for Hapi.
 */
const Database = require('./database');
const Endpoints = require('./endpoints');
const Authentication = require('./authentication');
const Docs = require('./docs');

module.exports = [
    { plugin: Database },
    { plugin: Endpoints },
    { plugin: Authentication },
    { plugin: Docs }
];
