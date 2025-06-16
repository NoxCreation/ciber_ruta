import argon2 from 'argon2';

export async function checkPassword(password: string, hashedPassword: string) {
    try {
        const match = await argon2.verify(`$argon2id$v=19$m=65536,t=3,p=4${hashedPassword}`, password);
        return match;
    } catch (error) {
        console.error('Error verifying password:', error);
        //throw error;
    }
}

export async function generateHash(password: string) {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword.split("$argon2id$v=19$m=65536,t=3,p=4")[1];
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

