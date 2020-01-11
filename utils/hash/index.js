import bcrypt from 'bcrypt';

async function generateHash(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function validatePassword(providedPassword, userPassword) {
    return bcrypt.compare(providedPassword, userPassword);
}

export { generateHash, validatePassword };
