import dotenv from 'dotenv';
import { server } from './server';

import { User } from './model/user';

dotenv.config();

const port = process.env.PORT || 8888;

server.listen(port, () => {
    console.log(`Server has started on port ${port}...`);
});




