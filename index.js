/* eslint-disable capitalized-comments,complexity,prefer-destructuring */
'use strict';

const crypto = require('crypto');
const util = require('util');
const tsse = require('tsse');
const phc = require('@phc/format');
const gensalt = require('@kdf/salt');

const scryptPromisify = util.promisify(crypto.scrypt);

const MAX_UINT32 = 4294967295; // 2**32 - 1

// Max memory Node can use. Being generous to allow most usages, without abuse.
const MAX_MEM = 128 * 1024 * 1024;

/**
 * Default configurations used to generate a new hash.
 * @private
 * @type {Object}
 */
const defaults = Object.freeze({
  // CPU/memory cost (N), in number of sequential hash results stored in RAM by the ROMix function.
  cost: 15, // 2^15
  // blocksize (r), in bits used by the BlockMix function.
  blocksize: 8,
  // parallelism (p), in number of instances of the mixing function run independently.
  parallelism: 1,
  // The minimum recommended size for the salt is 128 bits.
  saltSize: 16
});

/**
 * Computes the hash string of the given password in the PHC format using scrypt
 * package.
 * @public
 * @param  {string} password The password to hash.
 * @param  {Object} [options] Optional configurations related to the hashing
 * function.
 * @param  {number} [options.blocksize=8] Optional amount of memory to use in
 * kibibytes.
 * Must be an integer within the range (`8` <= `memory` <= `2^32-1`).
 * @param  {number} [options.cost=15] Optional CPU/memory cost parameter.
 * Must be an integer power of 2 within the range
 * (`2` <= `cost` <= `2^((128 * blocksize) / 8) - 1`).
 * @param  {number} [options.parallelism=1] Optional degree of parallelism to
 * use.
 * Must be an integer within the range
 * (`1` <= `parallelism` <= `((2^32-1) * 32) / (128 * blocksize)`).
 * @return {Promise.<string>} The generated secure hash string in the PHC
 * format.
 */
function hash(password, options) {
  options = options || {};
  const blocksize = options.blocksize || defaults.blocksize;
  const cost = options.cost || defaults.cost;
  const parallelism = options.parallelism || defaults.parallelism;
  const saltSize = options.saltSize || defaults.saltSize;

  // Blocksize Validation
  if (typeof blocksize !== 'number' || !Number.isInteger(blocksize)) {
    return Promise.reject(
      new TypeError("The 'blocksize' option must be an integer")
    );
  }
  if (blocksize < 1 || blocksize > MAX_UINT32) {
    return Promise.reject(
      new TypeError(
        `The 'blocksize' option must be in the range (1 <= blocksize <= ${MAX_UINT32})`
      )
    );
  }

  // Cost Validation
  if (typeof cost !== 'number' || !Number.isInteger(cost)) {
    return Promise.reject(
      new TypeError("The 'cost' option must be an integer")
    );
  }
  const maxcost = (128 * blocksize) / 8 - 1;
  if (cost < 2 || cost > maxcost) {
    return Promise.reject(
      new TypeError(
        `The 'cost' option must be in the range (1 <= cost <= ${maxcost})`
      )
    );
  }

  // Parallelism Validation
  if (typeof parallelism !== 'number' || !Number.isInteger(parallelism)) {
    return Promise.reject(
      new TypeError("The 'parallelism' option must be an integer")
    );
  }
  const maxpar = Math.floor(((Math.pow(2, 32) - 1) * 32) / (128 * blocksize));
  if (parallelism < 1 || parallelism > maxpar) {
    return Promise.reject(
      new TypeError(
        `The 'parallelism' option must be in the range (1 <= parallelism <= ${maxpar})`
      )
    );
  }

  // Salt Size Validation
  if (saltSize < 8 || saltSize > 1024) {
    return Promise.reject(
      new TypeError(
        "The 'saltSize' option must be in the range (8 <= saltSize <= 1023)"
      )
    );
  }

  const params = {
    N: Math.pow(2, cost),
    r: blocksize,
    p: parallelism,
    maxmem: MAX_MEM
  };
  const keylen = 32;

  return gensalt(saltSize).then(salt => {
    return scryptPromisify(password, salt, keylen, params).then(hash => {
      const phcstr = phc.serialize({
        id: 'scrypt',
        params: {
          ln: cost,
          r: blocksize,
          p: parallelism
        },
        salt,
        hash
      });
      return phcstr;
    });
  });
}

/**
 * Determines whether or not the hash stored inside the PHC formatted string
 * matches the hash generated for the password provided.
 * @public
 * @param  {string} phcstr Secure hash string generated from this package.
 * @param  {string} password User's password input.
 * @returns {Promise.<boolean>} A boolean that is true if the hash computed
 * for the password matches.
 */
function verify(phcstr, password) {
  let phcobj;
  try {
    phcobj = phc.deserialize(phcstr);
  } catch (err) {
    return Promise.reject(err);
  }

  // Identifier Validation
  if (phcobj.id !== 'scrypt') {
    return Promise.reject(
      new TypeError(`Incompatible ${phcobj.id} identifier found in the hash`)
    );
  }

  // Parameters Existence Validation
  if (typeof phcobj.params !== 'object') {
    return Promise.reject(new TypeError('The param section cannot be empty'));
  }

  // Blocksize Validation
  if (
    typeof phcobj.params.r !== 'number' ||
    !Number.isInteger(phcobj.params.r)
  ) {
    return Promise.reject(new TypeError("The 'r' param must be an integer"));
  }
  if (phcobj.params.r < 1 || phcobj.params.r > MAX_UINT32) {
    return Promise.reject(
      new TypeError(
        `The 'r' param must be in the range (1 <= r <= ${MAX_UINT32})`
      )
    );
  }

  // Cost Validation
  if (
    typeof phcobj.params.ln !== 'number' ||
    !Number.isInteger(phcobj.params.ln)
  ) {
    return Promise.reject(new TypeError("The 'ln' param must be an integer"));
  }
  const maxcost = (128 * phcobj.params.r) / 8 - 1;
  if (phcobj.params.ln < 1 || phcobj.params.ln > maxcost) {
    return Promise.reject(
      new TypeError(
        `The 'ln' param must be in the range (1 <= ln <= ${maxcost})`
      )
    );
  }

  // Parallelism Validation
  if (
    typeof phcobj.params.p !== 'number' ||
    !Number.isInteger(phcobj.params.p)
  ) {
    return Promise.reject(new TypeError("The 'p' param must be an integer"));
  }
  const maxpar = Math.floor(
    ((Math.pow(2, 32) - 1) * 32) / (128 * phcobj.params.p)
  );
  if (phcobj.params.p < 1 || phcobj.params.p > maxpar) {
    return Promise.reject(
      new TypeError(`The 'p' param must be in the range (1 <= p <= ${maxpar})`)
    );
  }

  const params = {
    N: Math.pow(2, phcobj.params.ln),
    r: phcobj.params.r,
    p: phcobj.params.p,
    maxmem: MAX_MEM
  };

  // Salt Validation
  if (typeof phcobj.salt === 'undefined') {
    return Promise.reject(new TypeError('No salt found in the given string'));
  }
  const salt = phcobj.salt;

  // Hash Validation
  if (typeof phcobj.hash === 'undefined') {
    return Promise.reject(new TypeError('No hash found in the given string'));
  }
  const hash = phcobj.hash;
  const keylen = phcobj.hash.byteLength;

  return scryptPromisify(password, salt, keylen, params).then(newhash => {
    const match = tsse(hash, newhash);
    return match;
  });
}

/**
 * Gets the list of all identifiers supported by this hashing function.
 * @public
 * @returns {string[]} A list of identifiers supported by this hashing function.
 */
function identifiers() {
  return ['scrypt'];
}

module.exports = {
  hash,
  verify,
  identifiers
};
