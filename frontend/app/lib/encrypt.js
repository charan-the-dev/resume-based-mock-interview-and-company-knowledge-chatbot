import crypto from "crypto";

// Encryption Hash Function
export function encryptPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

// Encryption Verification Function
export function verifyPassword(inputPassword, storedPassword) {
    return encryptPassword(inputPassword) === storedPassword; 
}