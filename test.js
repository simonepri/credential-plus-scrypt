import test from 'ava';
import pify from 'pify';

import m from 'credential-plus';

m.install(require('.'));

test('should verify a correct password with scrypt', async t => {
  const hash = await pify(m.hash)('hello world', {func: 'scrypt'});
  t.true(typeof hash === 'string');
  t.true(await pify(m.verify)(hash, 'hello world'));
});

test('should not verify a wrong password with scrypt', async t => {
  const hash = await pify(m.hash)('Hello world', {func: 'scrypt'});
  t.true(typeof hash === 'string');
  t.false(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should throw an error trying to hash a non valid string', async t => {
  let err = await t.throws(pify(m.hash)(undefined, {func: 'scrypt'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)('', {func: 'scrypt'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)(['unicorn'], {func: 'scrypt'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)(() => console.log('lalala'), {func: 'scrypt'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)(null, {func: 'scrypt'}));
  t.true(err instanceof Error);
});
