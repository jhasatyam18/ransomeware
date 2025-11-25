import CryptoJS from 'crypto-js';

/**
 * Decrypts the given ciphertext using the provided key.
 *
 * @param {string} ciphertext - The encrypted data (ciphertext) in Base64 format.
 * @param {string} key - The secret key used for decryption.
 * @returns {string} The decrypted data (plaintext) or null if decryption fails.
 */
export function decrypt(ciphertext, key) {
  try {
    // Convert Base64 encoded ciphertext to a CryptoJS WordArray
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    });

    // Decrypt the ciphertext using the key
    const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert the decrypted data to a UTF-8 string
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    return plaintext;
  } catch (error) {
    return null;
  }
}
