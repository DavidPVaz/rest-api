/**
 * @module Plugins
 * @file Gathers all Plugins for Hapi.
 */
const Config = require('config');
const Logger = require('./logger');
const Database = require('./database');
const Endpoints = require('./endpoints');
const Authentication = require('./authentication');
const Docs = require('./docs');

module.exports = [
    { plugin: Logger.plugin },
    { plugin: Database.plugin },
    { plugin: Docs.plugin },
    { plugin: Endpoints.plugin, routes: { prefix: Config.prefixes.api } },
    { plugin: Authentication.plugin }
];
