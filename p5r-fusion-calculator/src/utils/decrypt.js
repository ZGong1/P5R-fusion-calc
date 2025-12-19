/**
 * Persona 5 Royal Save File Decryption for Browser
 * Ported from Python save.py
 *
 * Dependencies: crypto-js, pako
 * Usage: decryptSaveFile(arrayBuffer) -> { success, data, error, logs }
 */

import CryptoJS from 'crypto-js';
import pako from 'pako';

/**
 * AES-256 decryption key (base64 encoded)
 */
const CRYPT_KEY_BASE64 = "3lOZS0kYSoOOtkC4c7IDfvNXnxIprUPTlUGVC3yBJF0=";

/**
 * Align value to boundary
 * @param {number} v - Value to align
 * @param {number} a - Alignment boundary
 * @returns {number} Aligned value
 */
function align(v, a) {
  return (v + (a - 1)) & ~(a - 1);
}

/**
 * CRC32 lookup table
 */
const CRC_TABLE = [
  0x00000000, 0x04c11db7, 0x09823b6e, 0x0d4326d9,
  0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005,
  0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61,
  0x350c9b64, 0x31cd86d3, 0x3c8ea00a, 0x384fbdbd,
  0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9,
  0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75,
  0x6a1936c8, 0x6ed82b7f, 0x639b0da6, 0x675a1011,
  0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd,
  0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039,
  0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5,
  0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81,
  0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d,
  0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49,
  0xc7361b4c, 0xc3f706fb, 0xceb42022, 0xca753d95,
  0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1,
  0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d,
  0x34867077, 0x30476dc0, 0x3d044b19, 0x39c556ae,
  0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072,
  0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16,
  0x018aeb13, 0x054bf6a4, 0x0808d07d, 0x0cc9cdca,
  0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde,
  0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02,
  0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066,
  0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba,
  0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e,
  0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692,
  0x8aad2b2f, 0x8e6c3698, 0x832f1041, 0x87ee0df6,
  0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a,
  0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e,
  0xf3b06b3b, 0xf771768c, 0xfa325055, 0xfef34de2,
  0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686,
  0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a,
  0x690ce0ee, 0x6dcdfd59, 0x608edb80, 0x644fc637,
  0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb,
  0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f,
  0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53,
  0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47,
  0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b,
  0x0315d626, 0x07d4cb91, 0x0a97ed48, 0x0e56f0ff,
  0x1011a0fa, 0x14d0bd4d, 0x19939b94, 0x1d528623,
  0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7,
  0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b,
  0xd727bbb6, 0xd3e6a601, 0xdea580d8, 0xda649d6f,
  0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3,
  0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7,
  0xae3afba2, 0xaafbe615, 0xa7b8c0cc, 0xa379dd7b,
  0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f,
  0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3,
  0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640,
  0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c,
  0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8,
  0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24,
  0x119b4be9, 0x155a565e, 0x18197087, 0x1cd86d30,
  0x029f3d35, 0x065e2082, 0x0b1d065b, 0x0fdc1bec,
  0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088,
  0x2497d08d, 0x2056cd3a, 0x2d15ebe3, 0x29d4f654,
  0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0,
  0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c,
  0xe3a1cbc1, 0xe760d676, 0xea23f0af, 0xeee2ed18,
  0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4,
  0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0,
  0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c,
  0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668,
  0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4
];

/**
 * Calculate CRC32 (matches Python calc_crc)
 * @param {ArrayBuffer|Uint8Array} buffer - Buffer to calculate CRC for
 * @param {number} [init=0xffffffff] - Initial CRC value
 * @returns {number} Calculated CRC32 value
 */
function calcCrc(buffer, init = 0xffffffff) {
  const arr = new Uint8Array(buffer);
  let crc = init;

  for (let i = 0; i < arr.length; i++) {
    crc = ((crc << 8) ^ CRC_TABLE[arr[i] ^ (crc >>> 24)]) >>> 0;
  }

  return crc;
}

/**
 * Read 32-bit unsigned integer in little-endian format
 * @param {ArrayBuffer} buffer - Buffer to read from
 * @param {number} offset - Byte offset
 * @returns {number} Unsigned 32-bit integer
 */
function readUInt32LE(buffer, offset) {
  const view = new DataView(buffer);
  return view.getUint32(offset, true);
}

/**
 * Read 16-bit unsigned integer in little-endian format
 * @param {ArrayBuffer} buffer - Buffer to read from
 * @param {number} offset - Byte offset
 * @returns {number} Unsigned 16-bit integer
 */
function readUInt16LE(buffer, offset) {
  const view = new DataView(buffer);
  return view.getUint16(offset, true);
}

/**
 * Decryption result object
 * @typedef {Object} DecryptionResult
 * @property {boolean} success - Whether decryption was successful
 * @property {Uint8Array} [data] - Decrypted save file data (only present if success is true)
 * @property {string} [error] - Error message (only present if success is false)
 * @property {string[]} [logs] - Decryption process logs
 */

/**
 * Main decryption function for Persona 5 Royal save files
 * @param {ArrayBuffer} arrayBuffer - Encrypted P5R save file (DATA.DAT)
 * @returns {DecryptionResult} Decryption result with data or error
 */
function decryptSaveFile(arrayBuffer) {
  const logs = [];

  try {
    const buffer = arrayBuffer;
    const uint8Array = new Uint8Array(buffer);

    // Read file header (0x00 - 0x20)
    const fileMagic = new TextDecoder().decode(uint8Array.slice(0, 4));
    const fileCrc = readUInt32LE(buffer, 0x04);
    const fileTimestamp = readUInt32LE(buffer, 0x08);
    let fileFlags = readUInt32LE(buffer, 0x0C);
    const fileIv = uint8Array.slice(0x10, 0x20);

    logs.push(`File magic: ${fileMagic}`);

    if (fileMagic !== 'DATA') {
      return { success: false, error: 'Invalid file magic. Expected "DATA".', logs };
    }

    // Verify file CRC (CRC is calculated from 0x08 onwards)
    const calculatedFileCrc = calcCrc(uint8Array.slice(0x08));
    logs.push(`File CRC: 0x${fileCrc.toString(16).padStart(8, '0')} check: 0x${calculatedFileCrc.toString(16).padStart(8, '0')}`);

    // Decrypt if encrypted (check bit 31 of fileFlags)
    let bufferDec = uint8Array;
    if (fileFlags >>> 31) {
      logs.push('File is encrypted, decrypting...');

      // Convert key from base64 to WordArray
      const keyWordArray = CryptoJS.enc.Base64.parse(CRYPT_KEY_BASE64);

      // Convert IV bytes to WordArray (16 bytes = 4 words)
      const ivWords = [];
      for (let i = 0; i < 16; i += 4) {
        ivWords.push(
          (fileIv[i] << 24) | (fileIv[i + 1] << 16) | (fileIv[i + 2] << 8) | fileIv[i + 3]
        );
      }
      const ivWordArray = CryptoJS.lib.WordArray.create(ivWords, 16);

      // Convert encrypted portion to WordArray (from 0x20 onwards)
      const encryptedData = uint8Array.slice(0x20);
      const encryptedWords = [];
      for (let i = 0; i < encryptedData.length; i += 4) {
        encryptedWords.push(
          (encryptedData[i] << 24) | (encryptedData[i + 1] << 16) |
          (encryptedData[i + 2] << 8) | encryptedData[i + 3]
        );
      }
      const encryptedWordArray = CryptoJS.lib.WordArray.create(encryptedWords, encryptedData.length);

      // Decrypt using AES-256-CBC
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedWordArray },
        keyWordArray,
        {
          iv: ivWordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.NoPadding
        }
      );

      // Convert decrypted WordArray back to Uint8Array
      const decryptedBytes = new Uint8Array(encryptedData.length);
      for (let i = 0; i < decrypted.words.length; i++) {
        const word = decrypted.words[i];
        const offset = i * 4;
        if (offset < decryptedBytes.length) decryptedBytes[offset] = (word >>> 24) & 0xff;
        if (offset + 1 < decryptedBytes.length) decryptedBytes[offset + 1] = (word >>> 16) & 0xff;
        if (offset + 2 < decryptedBytes.length) decryptedBytes[offset + 2] = (word >>> 8) & 0xff;
        if (offset + 3 < decryptedBytes.length) decryptedBytes[offset + 3] = word & 0xff;
      }

      // Combine unencrypted header with decrypted data
      bufferDec = new Uint8Array(uint8Array.length);
      bufferDec.set(uint8Array.slice(0, 0x20), 0);
      bufferDec.set(decryptedBytes, 0x20);

      fileFlags &= ~(1 << 31);
      logs.push('Decryption complete');
    }

    // Read save metadata (0x20 - 0x34)
    const headerSize = readUInt16LE(bufferDec.buffer, 0x20);
    const headerSizeComp = readUInt16LE(bufferDec.buffer, 0x22);
    const dataSize = readUInt32LE(bufferDec.buffer, 0x24);
    const dataSizeComp = readUInt32LE(bufferDec.buffer, 0x28);
    let saveFlags = readUInt32LE(bufferDec.buffer, 0x2C);
    const dataCrc = readUInt32LE(bufferDec.buffer, 0x30);

    logs.push(`Header size: ${headerSize}, compressed: ${headerSizeComp}`);
    logs.push(`Data size: ${dataSize}, compressed: ${dataSizeComp}`);
    logs.push(`Save flags: 0x${saveFlags.toString(16)}`);

    // Process header (starts at 0x40)
    let header;
    let dataOffset;

    if (saveFlags & 1) {
      // Header is compressed
      // NOTE: headerSizeComp includes the 0x40 offset in Python's pack()
      logs.push('Header is compressed, decompressing...');
      const compressedHeader = bufferDec.slice(0x40, headerSizeComp);
      try {
        header = pako.inflate(compressedHeader);
        logs.push(`Decompressed header size: ${header.length}`);
      } catch (e) {
        throw new Error(`Header decompression failed: ${e.message}`);
      }
      dataOffset = headerSizeComp;
      saveFlags &= ~1;
    } else {
      // Header is not compressed
      header = bufferDec.slice(0x40, headerSize);
      dataOffset = headerSize;
    }

    // Align data offset to 16 bytes
    dataOffset = align(dataOffset, 16);

    // Process data
    let data;

    if (saveFlags & 2) {
      // Data is compressed
      // NOTE: dataOffset is absolute position from start of buffer
      logs.push('Data is compressed, decompressing...');
      const compressedData = bufferDec.slice(dataOffset, dataOffset + dataSizeComp);
      logs.push(`Compressed data length: ${compressedData.length}, expected: ${dataSizeComp}`);
      try {
        data = pako.inflate(compressedData);
        logs.push(`Decompressed data size: ${data.length}`);
      } catch (e) {
        throw new Error(`Data decompression failed: ${e.message}`);
      }
      saveFlags &= ~2;
    } else {
      // Data is not compressed
      data = bufferDec.slice(dataOffset, dataOffset + dataSize);
    }

    // Verify data CRC
    const calculatedDataCrc = calcCrc(data);
    logs.push(`Data CRC: 0x${dataCrc.toString(16).padStart(8, '0')} check: 0x${calculatedDataCrc.toString(16).padStart(8, '0')}`);

    if (dataCrc !== calculatedDataCrc) {
      return {
        success: false,
        error: `Data CRC mismatch! Expected 0x${dataCrc.toString(16)}, got 0x${calculatedDataCrc.toString(16)}`,
        logs
      };
    }

    // Combine file metadata (0x00-0x3F), header, and data to preserve all offsets
    // This includes: file header (0x00-0x1F) + save metadata (0x20-0x3F) + header + data
    const fileMetadata = bufferDec.slice(0, 0x40);
    const fullSave = new Uint8Array(0x40 + header.length + data.length);
    fullSave.set(fileMetadata, 0);
    fullSave.set(header, 0x40);
    fullSave.set(data, 0x40 + header.length);

    logs.push('Decryption successful!');
    logs.push(`File metadata: 64 bytes (0x00-0x3F)`);
    logs.push(`Header size: ${header.length} bytes (0x${header.length.toString(16)}) at offset 0x40`);
    logs.push(`Data size: ${data.length} bytes (0x${data.length.toString(16)}) at offset 0x${(0x40 + header.length).toString(16)}`);
    logs.push(`Total decrypted size: ${fullSave.length} bytes (0x${fullSave.length.toString(16)})`);

    return {
      success: true,
      data: fullSave,
      logs: logs
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      logs: logs
    };
  }
}

// Export for ES6 modules
export { decryptSaveFile };
