import { expect, it } from 'vitest';
import { hello } from '../src/hello';

it('should say hello', () => {
  const result = hello();

  expect(result).toStrictEqual('Hello @a11ylint/core');
});
