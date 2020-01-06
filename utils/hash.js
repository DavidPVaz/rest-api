import bcrypt from 'bcrypt';

async function generateHash(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

export default {
    generateHash,
    validatePassword
};
