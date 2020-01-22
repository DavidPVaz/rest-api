import dotenv from 'dotenv';
import mailer from '../utils/mail';
import server from './server';

dotenv.config();

mailer.listen();

(async function() {

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
