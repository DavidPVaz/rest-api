import dotenv from 'dotenv';
import hash from '../utils/hash';

dotenv.config();

async function test() {
    const password = '123';
    const hashed = await hash.generateHash(password);

    console.log('hashed: ', hashed);

    const result = await hash.validatePassword(password, hashed);

    console.log('result: ', result);
}

test();
