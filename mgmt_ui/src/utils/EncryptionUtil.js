/**
 * Decrypts the given ciphertext using the provided key.
 * @param {string} ciphertext - The base64 encoded ciphertext to decrypt.
 * @param {string} key - The key used for decryption.
 * @returns {Promise<string>} - The decrypted data as a string.
 * @throws {Error} - If the ciphertext or key is not provided, or if decryption fails.
 */
export async function Decrypt(ciphertext, key) {
  try {
    if (!ciphertext || !key) {
      throw new Error('Ciphertext and key are required for decryption.');
    }

    let encryptedData;
    try {
      // atob is used to decode base64 encoded strings
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
      // In Vscode. showing as deprecated but it is not deprecated for browser
      // Deprecated for node js server apps
      encryptedData = atob(ciphertext);
    } catch (error) {
      throw new Error(`Failed to decode Base64: ${error.message}`);
    }

    if (encryptedData.length <= 12) {
      throw new Error('Ciphertext does not contain a nonce and data.');
    }

    const nonce = encryptedData.slice(0, 12);
    const cipherTextBytes = new Uint8Array(
      encryptedData.slice(12).split('').map((c) => c.charCodeAt(0)),
    );

    let cryptoKey;
    try {
      // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
      cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(key),
        { name: 'AES-GCM' },
        false,
        ['decrypt'],
      );
    } catch (error) {
      throw new Error(`Failed to import key: ${error.message}`);
    }

    // Decrypt the data
    let decryptedBytes;
    try {
      decryptedBytes = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(nonce.split('').map((c) => c.charCodeAt(0))),
        },
        cryptoKey,
        cipherTextBytes,
      );
    } catch (error) {
      throw new Error(`Failed to decrypt data: ${error.message}`);
    }

    // Convert the decrypted bytes to a string
    return new TextDecoder().decode(decryptedBytes);
  } catch (error) {
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}
