const Config = require('config');
const Mailer = require('utils/mail');
const server = require('server');
const dotenv = require('dotenv');

dotenv.config();
Mailer.listen();

(async function () {
    try {
        const hapi = await server.build();
        await hapi.start();
        server.registerNodeSignals(hapi);
        hapi.logger.child({ environment: Config.environment }).info('server bootstrap complete');
        console.log(`\nserver listening at port ${hapi.settings.port}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
