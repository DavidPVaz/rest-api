import dotenv from 'dotenv';
import mailer from '../utils/mail';
import { server } from './server';

dotenv.config();
const port = process.env.PORT || 8888;

mailer.listen();
server.listen(port, () => {
    console.log(`Server has started on port ${port}...`);
});
