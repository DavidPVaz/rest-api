import Database from './database';
import Endpoints from './endpoints';
import Authentication from './authentication';

export default [
    { plugin: Database },
    { plugin: Endpoints },
    { plugin: Authentication }
];
