import dotenv from 'dotenv';
import { server } from './server';

dotenv.config();

const port = process.env.PORT || 8888;

server.listen(port, () => {
    console.log(`Server has started on port ${port}...`);
});
