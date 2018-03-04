<h1 align="center">
  <b>@upash/scrypt</b>
</h1>
<p align="center">
  <!-- CI - TravisCI -->
  <a href="https://travis-ci.org/simonepri/upash-scrypt">
    <img src="https://img.shields.io/travis/simonepri/upash-scrypt/master.svg?label=MacOS%20%26%20Linux" alt="Mac/Linux Build Status" />
  </a>
  <!-- CI - AppVeyor -->
  <a href="https://ci.appveyor.com/project/simonepri/upash-scrypt">
    <img src="https://img.shields.io/appveyor/ci/simonepri/upash-scrypt/master.svg?label=Windows" alt="Windows Build status" />
  </a>
  <!-- Coverage - Codecov -->
  <a href="https://codecov.io/gh/simonepri/upash-scrypt">
    <img src="https://img.shields.io/codecov/c/github/simonepri/upash-scrypt/master.svg" alt="Codecov Coverage report" />
  </a>
  <!-- DM - Snyk -->
  <a href="https://snyk.io/test/github/simonepri/upash-scrypt?targetFile=package.json">
    <img src="https://snyk.io/test/github/simonepri/upash-scrypt/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" />
  </a>
  <!-- DM - David -->
  <a href="https://david-dm.org/simonepri/upash-scrypt">
    <img src="https://david-dm.org/simonepri/upash-scrypt/status.svg" alt="Dependency Status" />
  </a>

  <br/>

  <!-- Code Style - XO-Prettier -->
  <a href="https://github.com/xojs/xo">
    <img src="https://img.shields.io/badge/code_style-XO+Prettier-5ed9c7.svg" alt="XO Code Style used" />
  </a>
  <!-- Test Runner - AVA -->
  <a href="https://github.com/avajs/ava">
    <img src="https://img.shields.io/badge/test_runner-AVA-fb3170.svg" alt="AVA Test Runner used" />
  </a>
  <!-- Test Coverage - Istanbul -->
  <a href="https://github.com/istanbuljs/nyc">
    <img src="https://img.shields.io/badge/test_coverage-NYC-fec606.svg" alt="Istanbul Test Coverage used" />
  </a>
  <!-- Init - ni -->
  <a href="https://github.com/simonepri/ni">
    <img src="https://img.shields.io/badge/initialized_with-ni-e74c3c.svg" alt="NI Scaffolding System used" />
  </a>
  <!-- Release - np -->
  <a href="https://github.com/sindresorhus/np">
    <img src="https://img.shields.io/badge/released_with-np-6c8784.svg" alt="NP Release System used" />
  </a>

  <br/>

  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/@upash/scrypt">
    <img src="https://img.shields.io/npm/v/@upash/scrypt.svg" alt="Latest version on npm" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/upash-scrypt/tree/master/license">
    <img src="https://img.shields.io/github/license/simonepri/upash-scrypt.svg" alt="Project license" />
  </a>
</p>
<p align="center">
  🔒 Easy to use Unified API for scrypt password hashing algorithm.

  <br/>

  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>

## Synopsis
This package is part of the [upash][upash] project,
which aim is to provide a unified and user-friendly APIs for all the passwords
hashing algorithms out there.  

In particular, this package wraps the [scrypt][npm:scrypt]
package providing a simplified API with up to date secure default configurations.

Do you believe that this is *useful*?
It has *saved you time*?
Or maybe you simply *like it*?  
If so, [show your appreciation with a Star ⭐️][start].

## Install
```bash
npm install --save @upash/scrypt
```

## Usage
```js
const scrypt = require('@upash/scrypt');

// Hash and verify with scrypt using default secure configs
scrypt.hash('We are all unicorns')
  .then(hash => {
    console.log(hash);
    // => "c2NyeXB0AAoAAAAIAAAAAa14PPQVNqXy2D5PBWHjMGQnXWzWN+yvzdlKIEk3D7wdDUk59jRL4djGGZxCW1IvFFM32xjW3m3cEQ9FKyGNc5HEGm/cbx2RH9yLHA5LniGq"
    // You can store this directly in your database.

    scrypt.verify(hash, 'We are all unicorns')
      .then(match => {
        console.log(match);
        // => true
      });
  });
```

## API
<dl>
<dt><a href="#hash">hash(password, [options])</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Applies the hashing algorithm to the provided password.</p>
</dd>
<dt><a href="#verify">verify(hash, password)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Determines whether the user&#39;s input matches the stored password or not.</p>
</dd>
</dl>

<a name="hash"></a>

## hash(password, [options]) ⇒ <code>Promise.&lt;string&gt;</code>
Applies the hashing algorithm to the provided password.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - The generated hash string.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | The password to hash. |
| [options] | <code>Object</code> | Configurations passed to the hashing function. |
| [options.maxtime] | <code>number</code> | The maximum amount of time in seconds spent to compute the derived key. |
| [options.maxmem] | <code>number</code> | The maximum number of bytes of RAM used when computing the derived encryption key. |
| [options.maxmemfrac] | <code>number</code> | The fraction of the available RAM used when computing the derived key. |

<a name="verify"></a>

## verify(hash, password) ⇒ <code>Promise.&lt;boolean&gt;</code>
Determines whether the user's input matches the stored password or not.

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A boolean that is true if the hash computed for
the password matches the provided hash.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | The hash string generated by this package. |
| password | <code>string</code> | The user's password input. |

## Related
- [@upash/universal][universal] -
🔒 Easy to use Unified API for all password hashing algorithms.
- [@upash/argon2][argon2] -
🔒 Easy to use Unified API for Argon2 password hashing algorithm.
- [@upash/bcrypt][bcrypt] -
🔒 Easy to use Unified API for bcrypt password hashing algorithm.
- [@upash/pbkdf2][pbkdf2] -
🔒 Easy to use Unified API for pbkdf2-crypt password hashing algorithm.

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
PLEASE [report it][new issue].  
Please check the [contributing guidelines][contributing] for more details.  
Thanks!

## Authors
- **Simone Primarosa** - *Follow* me on
*Github* ([:octocat:@simonepri][github:simonepri]) and on
*Twitter* ([🐦@simonepri][twitter:simonepri])

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[upash]: https://github.com/simonepri/upash-scrypt

[start]: https://github.com/simonepri/upash-scrypt#start-of-content
[new issue]: https://github.com/simonepri/upash-scrypt/issues/new
[contributors]: https://github.com/simonepri/upash-scrypt/contributors

[license]: https://github.com/simonepri/upash-scrypt/tree/master/license
[contributing]: https://github.com/simonepri/upash-scrypt/tree/master/.github/contributing.m

[universal]: https://github.com/simonepri/upash-universal
[argon2]: https://github.com/simonepri/upash-argon2
[bcrypt]: https://github.com/simonepri/upash-bcrypt
[pbkdf2]: https://github.com/simonepri/upash-pbkdf2d

[npm:scrypt]: https://www.npmjs.com/package/scrypt

[github:simonepri]: https://github.com/simonepri
[twitter:simonepri]: http://twitter.com/intent/user?screen_name=simoneprimarosa
