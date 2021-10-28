const mailer = require('utils/mail');
const server = require('server');
const dotenv = require('dotenv');

dotenv.config();
mailer.listen();

(async function () {
    try {
        const hapi = await server.build();
        await hapi.start();
        server.registerNodeSignals(hapi);
        console.log(`server listening at port ${hapi.settings.port}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
