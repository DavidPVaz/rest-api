import dotenv from 'dotenv';
import mailer from '../utils/mail';
import buildServer from './server';

dotenv.config();

mailer.listen();

(async function() {

    try {
        const server = await buildServer();
        await server.start();
        console.log(`server listening at port ${server.settings.port}`);
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    
})();
