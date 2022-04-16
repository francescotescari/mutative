import { create } from '../src';

describe('base', () => {
  test('object', () => {
    const data = {
      foo: {
        bar: 'str',
      },
      foobar: {},
    };

    const state = create(data, (draft) => {
      draft.foo.bar = 'new str';
    });
    expect(state).toEqual({ foo: { bar: 'new str' }, foobar: {} });
    expect(
      state !==
        {
          foo: {
            bar: 'str',
          },
          foobar: {},
        }
    ).toBeTruthy();
    expect(state).not.toBe(data);
    expect(state.foo).not.toBe(data.foo);
    expect(state.foobar).toBe(data.foobar);
  });

  test('no updates for object', () => {
    const data = {
      foo: {
        bar: 'str',
      },
      foobar: {},
    };

    const state = create(data, (draft) => {
      draft.foo.bar = 'new str';
      draft.foo.bar = 'str';
    });
    expect(state).toBe(data);
  });

  test('no update for array', () => {
    const data = {
      arr: ['str'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.arr[0] = 'new str';
      draft.arr[0] = 'str';
    });
    expect(state).toBe(data);
  });

  test('no update for array with push and pop', () => {
    const data = {
      arr: ['str'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.arr.push('new str');
      draft.arr.pop();
    });
    expect(state).toBe(data);
  });

  test('no update 2 items for array with push and pop', () => {
    const data = {
      arr: ['str'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.arr.push('new str', 'new str1');
      draft.arr.pop();
      draft.arr.pop();
    });
    expect(state).toBe(data);
  });

  test('no update for array with splice', () => {
    const data = {
      arr: ['a', 'b', 'c'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      const result = draft.arr.splice(1, 1, 'new str', 'new str1');
      draft.arr.splice(1, 2, ...result);
    });
    expect(state).toBe(data);
  });

  test('no update for array with splice', () => {
    const data = {
      arr: ['a', 'b', 'c'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      const result = draft.arr.splice(1, 1);
      draft.arr.splice(1, 0, ...result);
    });
    expect(state).toBe(data);
  });

  test('no update for array with reverse', () => {
    const data = {
      arr: ['1', '3', '2'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.arr.reverse();
      draft.arr.reverse();
    });
    expect(state).toBe(data);
  });

  test('no update for array with shift and unshift', () => {
    const data = {
      arr: ['1'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.arr.unshift('new str');
      draft.arr.shift();
    });
    expect(state).toBe(data);
  });

  test('no update 2 items for array with shift and unshift', () => {
    const data = {
      arr: ['1'] as any,
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.arr.unshift('new str', 'new str1');
      draft.arr.shift();
      draft.arr.shift();
    });
    expect(state).toBe(data);
  });

  test('no update for set', () => {
    const data = {
      set: new Set([{}]),
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      const a = {};
      draft.set.add(a);
      draft.set.delete(a);
    });
    expect(state).toBe(data);
  });

  test('no update for set', () => {
    const a = {};
    const data = {
      set: new Set([a]),
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.set.delete(a);
      draft.set.add(a);
    });
    expect(state).toBe(data);
  });

  test('no update for map', () => {
    const data = {
      map: new Map([
        [1, { a: { b: 1 } }],
        [2, { a: { b: 2 } }],
        [3, { a: { b: 3 } }],
      ]),
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.map.set(4, {} as any);
      draft.map.delete(4);
    });
    expect(state).toBe(data);
  });

  test('no update for map', () => {
    const data = {
      map: new Map([
        [1, { a: { b: 1 } }],
        [2, { a: { b: 2 } }],
        [3, { a: { b: 3 } }],
      ]),
      foo: 'bar',
    };

    const state = create(data, (draft) => {
      draft.map.get(1)!.a.b = 2;
      draft.map.get(1)!.a.b = 1;
    });
    expect(state).toBe(data);
  });

  test('delete key in object', () => {
    const data = {
      foo: {
        bar: {
          b: 'str',
        },
      },
      foobar: {
        bar: 'str',
      },
    };

    const [state, patches, inversePatches] = create(
      data,
      (draft) => {
        draft.foo.bar.b = 'new str';
        // @ts-ignore
        delete draft.foo.bar;
      },
      {
        enablePatches: true,
      }
    );
    expect(state).toEqual({ foo: {}, foobar: { bar: 'str' } });
    expect(
      state !==
        ({
          foo: {},
          foobar: { bar: 'str' },
        } as any)
    ).toBeTruthy();
    expect(state !== data).toBeTruthy();
    expect(state.foo !== data.foo).toBeTruthy();
    expect(state.foobar === data.foobar).toBeTruthy();
  });

  test('object case1', () => {
    const data = {
      foo: {
        bar: {
          baz: 'baz',
        },
      },
      foobar: {},
    };

    const state = create(data, (draft) => {
      const foo = draft.foo;
      draft.foobar;
      foo.bar = { baz: 'new baz' };
    });
    expect(state).toEqual({ foo: { bar: { baz: 'new baz' } }, foobar: {} });
  });

  test('object case2', () => {
    const d = { e: 1 };
    const baseState = { a: { b: { c: { d } } }, f: { d } };
    const state = create(baseState, (draft) => {
      const a = draft.a.b;
      // @ts-ignore
      draft.x = a;
      a.c.d.e = 2;
    });
    // @ts-ignore
    expect(state.x === state.a.b).toBeTruthy();
  });

  test('object case3', () => {
    const d = { e: 1 };
    const baseState = { a: { c: { e: 2 }, b: { c: { d } } }, f: { d } };
    const state = create(baseState, (draft) => {
      const a = draft.a.c;
      // @ts-ignore
      draft.x = a;
      const c = draft.a.b;
      // @ts-ignore
      c.c.d.e = 2;
    });
    expect(state).toEqual({
      a: { c: { e: 2 }, b: { c: { d: { e: 2 } } } },
      f: { d: { e: 1 } },
      x: { e: 2 },
    });
    // @ts-ignore
    expect(state.x).toEqual(state.a.c);
    // @ts-ignore
    expect(state.x).toBe(state.a.c);
  });

  test('performance', () => {
    const baseState: any = {};
    Array(10 ** 5)
      .fill(1)
      .forEach((_, i) => {
        baseState[i] = { i };
      });
    console.time();
    create(baseState, (draft) => {
      draft[0].c = { i: 0 };
    });
    console.timeEnd();
  });

  test('performance 100k', () => {
    const a = Array(10 ** 5)
      .fill(1)
      .map((_, i) => ({ [i]: i }));
    console.time('performance 100k');
    create({ b: { c: 2 }, a }, (draft) => {
      draft.b.c = 3;
      draft.a.push({ '1': 1 });
    });
    console.timeEnd('performance 100k');
  });

  test('base array', () => {
    const data = {
      list: ['foo'],
      bar: {},
    };

    const state = create(
      data,
      (draft) => {
        draft.list.push('bar');
        // Array.prototype.push.call(draft.list, 'bar');
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({ list: ['foo', 'bar'], bar: {} });
    expect(
      state !==
        {
          list: ['foo', 'bar'],
          bar: {},
        }
    ).toBeTruthy();
    expect(state !== data).toBeTruthy();
    expect(state.list !== data.list).toBeTruthy();
    expect(state.bar === data.bar).toBeTruthy();
  });

  test('base array set', () => {
    const data = {
      list: ['foo'],
      bar: {},
    };

    const [state, patches, inversePatches] = create(
      data,
      (draft) => {
        draft.list[1] = 'bar';
      },
      {
        enablePatches: true,
      }
    );
    expect(state).toEqual({ list: ['foo', 'bar'], bar: {} });
    expect(
      state !==
        {
          list: ['foo', 'bar'],
          bar: {},
        }
    ).toBeTruthy();
    expect(state !== data).toBeTruthy();
    expect(state.list !== data.list).toBeTruthy();
    expect(state.bar === data.bar).toBeTruthy();
  });

  test('base array set with object', () => {
    const data = {
      list: [{ a: 1 }, { a: 2 }, { a: 3 }],
      bar: {},
    };

    const state = create(
      data,
      (draft) => {
        draft.list[1].a = 4;
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({ list: [{ a: 1 }, { a: 4 }, { a: 3 }], bar: {} });
    expect(
      state !==
        {
          list: [{ a: 1 }, { a: 4 }, { a: 3 }],
          bar: {},
        }
    ).toBeTruthy();
    expect(state !== data).toBeTruthy();
    expect(state.list !== data.list).toBeTruthy();
    expect(state.bar === data.bar).toBeTruthy();
    expect(state.list[0] === data.list[0]).toBeTruthy();
  });

  test('base object set ref object', () => {
    const data: any = {
      bar: { a: { c: 1 }, b: { x: 1 } },
    };

    const state = create(
      data,
      (draft) => {
        draft.a = draft.bar;
        draft.bar.a.c = 2;
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({
      bar: { a: { c: 2 }, b: { x: 1 } },
      a: { a: { c: 2 }, b: { x: 1 } },
    });
    expect(state.a).toBe(state.bar);
  });

  test('base object set ref object', () => {
    const data: any = {
      bar: { a: { c: 1 }, b: { x: 1 } },
    };

    const state = create(
      data,
      (draft) => {
        draft.bar.a.c = 2;
        draft.a = draft.bar;
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({
      bar: { a: { c: 2 }, b: { x: 1 } },
      a: { a: { c: 2 }, b: { x: 1 } },
    });
    expect(state.a).toBe(state.bar);
  });

  test('base array set ref array', () => {
    const data: any = {
      bar: { a: [1, 2, 3], b: { x: 1 } },
    };

    const state = create(
      data,
      (draft) => {
        draft.bar.a.push(4);
        draft.a = draft.bar;
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({
      bar: { a: [1, 2, 3, 4], b: { x: 1 } },
      a: { a: [1, 2, 3, 4], b: { x: 1 } },
    });
    expect(state.a).toBe(state.bar);
  });

  test('base object set ref object1', () => {
    const data: any = {
      bar: { a: { c: 1 }, b: { x: 1 } },
    };

    const state = create(
      data,
      (draft) => {
        draft.bar.a.c = 2;
        draft.k = draft.bar;
        draft.k.a = 3;
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({
      bar: { a: 3, b: { x: 1 } },
      k: { a: 3, b: { x: 1 } },
    });
  });

  test('base object set ref object2', () => {
    const a = { c: 1 };
    const data: any = {
      bar: { a, b: { a } },
    };

    const state = create(
      data,
      (draft) => {
        draft.bar.a.c = 2;
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({ bar: { a: { c: 2 }, b: { a: { c: 1 } } } });
  });

  test('base array push', () => {
    const data = {
      bar: {},
      list: [{ text: '' }],
    };

    const state = create(data, (draft) => {
      draft.list.push({ text: 'foo' });
    });
    expect(state).toEqual({ bar: {}, list: [{ text: '' }, { text: 'foo' }] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
    expect(state.list[0]).toBe(data.list[0]);
    expect(state.list[1]).not.toBe(data.list[1]);
  });

  test('base array pop', () => {
    const data = {
      bar: {},
      list: [{ text: '' }],
    };

    const state = create(data, (draft) => {
      draft.list.pop();
    });
    expect(state).toEqual({ bar: {}, list: [] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array reverse', () => {
    const data = {
      bar: {},
      list: [{ text: 'foobar' }, { text: 'foo' }],
    };

    const state = create(data, (draft) => {
      draft.list.reverse();
    });
    expect(state).toEqual({
      bar: {},
      list: [{ text: 'foo' }, { text: 'foobar' }],
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
    expect(state.list[0]).toBe(data.list[1]);
    expect(state.list[1]).toBe(data.list[0]);
  });

  test('base array shift', () => {
    const data = {
      bar: {},
      list: [{ text: 'foobar' }, { text: 'foo' }],
    };

    const state = create(data, (draft) => {
      draft.list.shift();
    });
    expect(state).toEqual({ bar: {}, list: [{ text: 'foo' }] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array shift', () => {
    const data = {
      bar: {},
      list: [{ text: 'foobar' }],
    };

    const state = create(data, (draft) => {
      draft.list.unshift({ text: 'foo' });
    });
    expect(state).toEqual({
      bar: {},
      list: [{ text: 'foo' }, { text: 'foobar' }],
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array splice', () => {
    const data = {
      bar: {},
      list: [{ text: 'foobar' }, { text: 'bar' }, { text: 'bar1' }],
    };

    const state = create(data, (draft) => {
      draft.list.splice(1, 2, { text: 'foo' });
    });
    expect(state).toEqual({
      bar: {},
      list: [{ text: 'foobar' }, { text: 'foo' }],
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array sort', () => {
    const data = {
      bar: {},
      list: [3, 1, 2, 4],
    };

    const state = create(data, (draft) => {
      draft.list.sort();
    });
    expect(state).toEqual({ bar: {}, list: [1, 2, 3, 4] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array fill', () => {
    const data = {
      bar: {},
      list: new Array(3),
    };

    const state = create(data, (draft) => {
      draft.list.fill(1);
    });
    expect(state).toEqual({ bar: {}, list: [1, 1, 1] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array copyWithin 0', () => {
    const data = {
      bar: {},
      list: [1, 2, 3, 4, 5],
    };

    const state = create(data, (draft) => {
      // @ts-ignore
      draft.list.copyWithin(-2);
    });
    expect(state).toEqual({ bar: {}, list: [1, 2, 3, 1, 2] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array copyWithin 1', () => {
    const data = {
      bar: {},
      list: [1, 2, 3, 4, 5],
    };

    const state = create(data, (draft) => {
      // @ts-ignore
      draft.list.copyWithin(0, 3);
    });
    expect(state).toEqual({ bar: {}, list: [4, 5, 3, 4, 5] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array copyWithin 2', () => {
    const data = {
      bar: {},
      list: [1, 2, 3, 4, 5],
    };

    const state = create(data, (draft) => {
      // @ts-ignore
      draft.list.copyWithin(0, 3, 4);
    });
    expect(state).toEqual({ bar: {}, list: [4, 2, 3, 4, 5] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array copyWithin 3', () => {
    const data = {
      bar: {},
      list: [1, 2, 3, 4, 5],
    };

    const state = create(data, (draft) => {
      // @ts-ignore
      draft.list.copyWithin(-2, -3, -1);
    });
    expect(state).toEqual({ bar: {}, list: [1, 2, 3, 3, 4] });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.list).not.toBe(data.list);
  });

  test('base array copyWithin 4', () => {
    const data = {
      bar: {},
      list: [1, 2, 3, 4, 5],
    };

    const state = create(data, (draft) => {
      // @ts-ignore
      draft.list.copyWithin(-3, -3);
    });
    expect(state).toEqual({ bar: {}, list: [1, 2, 3, 4, 5] });
    // no updates
    expect(state).toBe(data);
  });

  test('base set add', () => {
    const data = {
      bar: {},
      set: new Set([1, 2, 3]),
    };

    const state = create(data, (draft) => {
      draft.set.add(4);
    });
    expect(state).toEqual({
      bar: {},
      set: new Set([1, 2, 3, 4]),
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.set).not.toBe(data.set);
  });

  test('base set clear', () => {
    const data = {
      bar: {},
      set: new Set([1, 2, 3]),
    };

    const state = create(data, (draft) => {
      draft.set.clear();
    });
    expect(state).toEqual({
      bar: {},
      set: new Set(),
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.set).not.toBe(data.set);
  });

  test('base set delete', () => {
    const data = {
      bar: { a: 1 },
      set: new Set([1, 2, 3]),
    };

    const state = create(data, (draft) => {
      draft.bar.a;
      draft.set.delete(2);
    });
    expect(state).toEqual({
      bar: { a: 1 },
      set: new Set([1, 3]),
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.set).not.toBe(data.set);
  });

  test('base map set', () => {
    const data = {
      bar: {},
      map: new Map([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    };

    const state = create(data, (draft) => {
      draft.map.set(4, 4);
    });
    expect(state).toEqual({
      bar: {},
      map: new Map([
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
      ]),
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.map).not.toBe(data.map);
  });

  test('base map clear', () => {
    const data = {
      bar: {},
      map: new Map([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    };

    const state = create(data, (draft) => {
      draft.map.clear();
    });
    expect(state).toEqual({
      bar: {},
      map: new Map(),
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.map).not.toBe(data.map);
  });

  test('base map delete', () => {
    const data = {
      bar: { a: 1 },
      map: new Map([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    };

    const state = create(data, (draft) => {
      draft.bar.a;
      draft.map.delete(2);
    });
    expect(state).toEqual({
      bar: { a: 1 },
      map: new Map([
        [1, 1],
        [3, 3],
      ]),
    });
    expect(state).not.toBe(data);
    expect(state.bar).toBe(data.bar);
    expect(state.map).not.toBe(data.map);
  });

  test('base freeze', () => {
    const data = {
      bar: { a: 1 },
      list: [{ id: 1 }],
    };

    const state = create(
      data,
      (draft) => {
        draft.list.push({ id: 2 });
        draft.bar.a = 2;
      },
      {
        enableFreeze: true,
      }
    );
    expect(state).toEqual({ bar: { a: 2 }, list: [{ id: 1 }, { id: 2 }] });
    expect(state).not.toBe(data);
    expect(state.bar).not.toBe(data.bar);
    expect(state.list).not.toBe(data.list);
    expect(() => {
      state.bar.a = 3;
    }).toThrowError();
    expect(() => {
      state.list.push({ id: 3 });
    }).toThrowError();
    expect(() => {
      state.list[0].id = 3;
    }).toThrowError();
    expect(() => {
      state.list[1].id = 3;
    }).toThrowError();

    const state1 = create(
      state,
      (draft) => {
        draft.list.push({ id: 2 });
        draft.bar.a = 2;
      },
      {
        enableFreeze: false,
      }
    );
    expect(() => {
      state1.list[0].id = 3;
    }).toThrowError();
    expect(() => {
      state1.list[1].id = 3;
    }).toThrowError();
    state1.list.push({ id: 4 });
    state1.bar.a = 4;
  });

  test('base set freeze', () => {
    const data = {
      set: new Set([1, 2, 3]),
    };

    const state = create(
      data,
      (draft) => {
        draft.set.delete(2);
      },
      {
        enableFreeze: true,
      }
    );
    expect(state).toEqual({
      set: new Set([1, 3]),
    });
    expect(state).not.toBe(data);
    expect(() => {
      state.set.add(4);
    }).toThrowError();
    expect(() => {
      state.set.delete(1);
    }).toThrowError();
    expect(() => {
      state.set.clear();
    }).toThrowError();
  });

  test('base map freeze', () => {
    const data = {
      map: new Map([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    };

    const state = create(
      data,
      (draft) => {
        draft.map.delete(2);
      },
      {
        enableFreeze: true,
      }
    );
    expect(state).toEqual({
      map: new Map([
        [1, 1],
        [3, 3],
      ]),
    });

    expect(() => {
      state.map.set(4, 4);
    }).toThrowError();
    expect(() => {
      state.map.delete(1);
    }).toThrowError();
    expect(() => {
      state.map.clear();
    }).toThrowError();
  });

  test('base map with deep object', () => {
    const a = { a: 1 };
    const b = {};
    const data = {
      bar: {},
      map: new Map([
        [a, {}],
        [b, {}],
        [{}, {}],
      ]),
    };

    const state = create(data, (draft) => {
      // @ts-ignore
      draft.map.values().next().value.x = 1;
      for (const [key, item] of draft.map) {
        // @ts-ignore
        if (item.x === 1) {
          // @ts-ignore
          item.c = 2;
        }
      }
    });
    expect(state).toEqual({
      bar: {},
      map: new Map([
        [a, { x: 1, c: 2 }],
        [b, {}],
        [{}, {}],
      ]),
    });
    expect(state).not.toBe(data);
    expect([...state.map.values()][0]).not.toBe([...data.map.values()][0]);
    expect([...state.map.values()][1]).toBe([...data.map.values()][1]);
  });

  test('base set deep object', () => {
    const a = { a: 1 };
    const b = {};
    const data = {
      bar: {},
      set: new Set([a, b]),
    };

    const state = create(
      data,
      (draft) => {
        draft.set.values().next().value.x = 1;
        const [first] = draft.set.values();
        expect(draft.set.has(first)).toBeTruthy();
        for (const item of draft.set) {
          // @ts-ignore
          if (item.x === 1) {
            // @ts-ignore
            item.c = 2;
          }
        }
      },
      {
        enablePatches: false,
      }
    );
    expect(state).toEqual({
      bar: {},
      set: new Set([{ a: 1, x: 1, c: 2 }, {}]),
    });
    expect(state).not.toBe(data);
    expect([...state.set.values()][0]).not.toBe([...data.set.values()][0]);
    expect([...state.set.values()][1]).toBe([...data.set.values()][1]);
  });

  test('only mutable object', () => {
    const data = {
      foo: {
        bar: 'str',
      },
      foobar: {} as any,
    };

    const state = create(
      data,
      (draft) => {
        draft.foobar.text = 'new text';
      },
      {
        mutable: (target) => target === data.foobar,
      }
    );
    expect(state).toEqual({
      foo: { bar: 'str' },
      foobar: { text: 'new text' },
    });
    expect(state).toBe(data);
  });

  test('object with mutable', () => {
    const data = {
      foo: {
        bar: 'str',
      },
      foobar: {} as any,
    };

    const state = create(
      data,
      (draft) => {
        draft.foo.bar = 'new str';
        draft.foobar.text = 'new text';
      },
      {
        mutable: (target) => target === data.foobar,
      }
    );
    expect(state).toEqual({
      foo: { bar: 'new str' },
      foobar: { text: 'new text' },
    });
    expect(state).not.toBe(data);
    expect(state.foo).not.toBe(data.foo);
    expect(state.foobar).toBe(data.foobar);
  });

  test('array with mutable', () => {
    const data = {
      foo: {
        bar: 'str',
      },
      arr: [] as any,
    };

    const state = create(
      data,
      (draft) => {
        draft.foo.bar = 'new str';
        draft.arr[0] = 'new text';
      },
      {
        mutable: (target) => target === data.arr,
      }
    );
    expect(state).toEqual({
      foo: { bar: 'new str' },
      arr: ['new text'],
    });
    expect(state).not.toBe(data);
    expect(state.foo).not.toBe(data.foo);
    expect(state.arr).toBe(data.arr);
  });

  test('map with mutable', () => {
    const foobar = {} as any;
    const data = {
      foo: {
        bar: 'str',
      },
      map: new Map([[1, { foobar }]]),
    };

    const state = create(
      data,
      (draft) => {
        draft.foo.bar = 'new str';
        draft.map.get(1)!.foobar.text = 'new text';
      },
      {
        mutable: (target) => target === foobar,
      }
    );
    expect(state).toEqual({
      foo: {
        bar: 'new str',
      },
      map: new Map([[1, { foobar: { text: 'new text' } }]]),
    });
    expect(state).not.toBe(data);
    expect(state.foo).not.toBe(data.foo);
    expect(state.map.get(1)!.foobar).toBe(foobar);
  });

  test('set with mutable', () => {
    const foobar = {} as any;
    const data = {
      foo: {
        bar: 'str',
      },
      set: new Set([foobar]),
    };

    const state = create(
      data,
      (draft) => {
        draft.foo.bar = 'new str';
        draft.set.values().next().value.text = 'new text';
      },
      {
        mutable: (target) => target === foobar,
      }
    );
    expect(state).toEqual({
      foo: {
        bar: 'new str',
      },
      set: new Set([{ text: 'new text' }]),
    });
    expect(state).not.toBe(data);
    expect(state.foo).not.toBe(data.foo);
    expect([...state.set.values()][0]).toBe(foobar);
  });

  test('object changes with mutable data', () => {
    const foobar = {};
    const data = {
      foo: {
        bar: 'str',
      },
      foobar: {} as any,
    };

    const state = create(data, (draft) => {
      draft.foobar = foobar;
      draft.foobar.text = 'new text0';
      (foobar as any).text = 'new text1';
    });
    expect(state).toEqual({
      foo: { bar: 'str' },
      foobar: { text: 'new text1' },
    });
    expect(state).not.toBe(data);
    expect(state.foo).toBe(data.foo);
    expect(state.foobar).not.toBe(data.foobar);
    expect(state.foobar).toBe(foobar);
  });

  test('object changes with mutable data', () => {
    const foobar = {};
    const data = {
      foo: {
        bar: 'str',
      },
      foobar: {} as any,
    };

    const state = create(data, (draft) => {
      draft.foobar = foobar;
      draft.foobar.text = 'new text';
    });
    expect(state).toEqual({
      foo: { bar: 'str' },
      foobar: { text: 'new text' },
    });
    expect(state).not.toBe(data);
    expect(state.foo).toBe(data.foo);
    expect(state.foobar).not.toBe(data.foobar);
    expect(state.foobar).toBe(foobar);
  });

  test('array changes with mutable data', () => {
    const foobar = {};
    const data = {
      foo: {
        bar: 'str',
      },
      arr: [{} as any],
    };

    const state = create(data, (draft) => {
      draft.arr.pop();
      draft.arr.push(foobar);
      draft.arr[0].text = 'new text';
    });
    expect(state).toEqual({
      foo: { bar: 'str' },
      arr: [{ text: 'new text' }],
    });
    expect(state).not.toBe(data);
    expect(state.foo).toBe(data.foo);
    expect(state.arr[0]).not.toBe(data.arr[0]);
    expect(state.arr[0]).toBe(foobar);
  });

  test('set changes with mutable data', () => {
    const foobar = {};
    const data = {
      foo: {
        bar: 'str',
      },
      set: new Set([{} as any]),
    };

    const state = create(data, (draft) => {
      draft.set.clear();
      draft.set.add(foobar);
      [...draft.set.values()][0].text = 'new text';
    });
    expect(state).toEqual({
      foo: { bar: 'str' },
      set: new Set([{ text: 'new text' }]),
    });
    expect(state).not.toBe(data);
    expect(state.foo).toBe(data.foo);
    expect([...state.set.values()][0]).not.toBe([...data.set.values()][0]);
    expect([...state.set.values()][0]).toBe(foobar);
  });

  test('map changes with mutable data', () => {
    const foobar = {};
    const data = {
      foo: {
        bar: 'str',
      },
      map: new Map([[1, {} as any]]),
    };

    const state = create(data, (draft) => {
      draft.map.delete(1);
      draft.map.set(1, foobar);
      draft.map.get(1).text = 'new text';
    });
    expect(state).toEqual({
      foo: { bar: 'str' },
      map: new Map([[1, { text: 'new text' }]]),
    });
    expect(state).not.toBe(data);
    expect(state.foo).toBe(data.foo);
    expect(state.map.get(1)).not.toBe(data.map.get(1));
    expect(state.map.get(1)).toBe(foobar);
  });
});
