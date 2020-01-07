import dotenv from 'dotenv';
import { generateHash, validatePassword } from '../utils';

dotenv.config();

async function test() {
    const password = '123';
    const hashed = await generateHash(password);

    console.log('hashed: ', hashed);

    const result = await validatePassword(password, hashed);

    console.log('result: ', result);
}

test();
