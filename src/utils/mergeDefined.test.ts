import { mergeDefined } from './mergeDefined';

describe('mergeDefined', () => {
  it('overwrites scalar values from source', () => {
    const target = { a: 'old', b: 'keep' };
    const source = { a: 'new' };
    expect(mergeDefined(target, source)).toEqual({ a: 'new', b: 'keep' });
  });

  it('skips undefined and null in source', () => {
    const target = { a: 'keep', b: 'keep' };
    const source = { a: undefined, b: null };
    expect(mergeDefined(target, source as Record<string, unknown>)).toEqual({
      a: 'keep',
      b: 'keep',
    });
  });

  it('deep merges nested objects', () => {
    const target = {
      person: { firstName: 'Alice', lastName: 'Old' },
      count: 1,
    };
    const source = {
      person: { lastName: 'New' },
    };
    expect(mergeDefined(target, source)).toEqual({
      person: { firstName: 'Alice', lastName: 'New' },
      count: 1,
    });
  });

  it('replaces arrays from source', () => {
    const target = { items: ['a'] };
    const source = { items: ['b', 'c'] };
    expect(mergeDefined(target, source)).toEqual({ items: ['b', 'c'] });
  });
});
