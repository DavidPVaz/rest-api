import bcrypt from 'bcrypt';

export async function generateHash(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}
