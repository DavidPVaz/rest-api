import dotenv from 'dotenv';
import mailer from '../utils/mail';
import { server } from './server';

dotenv.config();

mailer.listen();

(async function() {

    try {
        await server.start();
        console.log(`server listening at port ${server.settings.port}`);
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    
})();
