/** biome-ignore-all lint/suspicious/noExplicitAny: This just for testing*/
import { createFormatter, type FormatterDef } from '../src'

const abFormatter = {
  isType: (value): value is { a: any; b: any } =>
    value && typeof value === 'object' && 'a' in value && 'b' in value,
  formatters: {
    ab(value) {
      return `AB: ${value.a},${value.b}`
    },
  },
} satisfies FormatterDef<{ a: any; b: any }>

const bcFormatter = {
  isType: (value): value is { b: any; c: any } =>
    value && typeof value === 'object' && 'b' in value && 'c' in value,
  formatters: {
    bc(value) {
      return `BC: ${value.b},${value.c}`
    },
  },
} satisfies FormatterDef<{ b: any; c: any }>

const cdFormatter = {
  isType: (value): value is { c: any; d: any } =>
    value && typeof value === 'object' && 'c' in value && 'd' in value,
  formatters: {
    cd(value) {
      return `CD: ${value.c},${value.d}`
    },
  },
} satisfies FormatterDef<{ c: any; d: any }>

const acFormatter = {
  isType: (value): value is { a: any; c: any } =>
    value && typeof value === 'object' && 'a' in value && 'c' in value,
  formatters: {
    ac(value) {
      return `AC: ${value.a},${value.c}`
    },
  },
} satisfies FormatterDef<{ a: any; c: any }>

const bdFormatter = {
  isType: (value): value is { b: any; d: any } =>
    value && typeof value === 'object' && 'b' in value && 'd' in value,
  formatters: {
    bd(value) {
      return `BD: ${value.b},${value.d}`
    },
  },
} satisfies FormatterDef<{ b: any; d: any }>

const adFormatter = {
  isType: (value): value is { a: any; d: any } =>
    value && typeof value === 'object' && 'a' in value && 'd' in value,
  formatters: {
    ad(value) {
      return `AD: ${value.a},${value.d}`
    },
  },
} satisfies FormatterDef<{ a: any; d: any }>

const f2 = createFormatter([
  abFormatter,
  bcFormatter,
  cdFormatter,
  acFormatter,
  bdFormatter,
  adFormatter,
])

import { describe, expect, test } from 'bun:test'

describe('intersection formatters', () => {
  test('should have ab and bc formatters on {a,b,c}', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(f2(obj).ab()).toBe('AB: 1,2')
    expect(f2(obj).ac()).toBe('AC: 1,3')
    expect(f2(obj).bc()).toBe('BC: 2,3')
    // @ts-expect-error Testing type error
    expect(() => f2(obj).cd()).toThrow()

    // @ts-expect-error Testing type error
    expect(() => f2(obj).ad()).toThrow()

    // @ts-expect-error Testing type error
    expect(() => f2(obj).bd()).toThrow()
  })

  test('should have only ab on {a,b}', () => {
    const obj = { a: 5, b: 6 }
    expect(f2(obj).ab()).toBe('AB: 5,6')
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bc()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).cd()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ad()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bd()).toThrow()
  })

  test('should have only bc on {b,c}', () => {
    const obj = { b: 7, c: 8 }
    expect(f2(obj).bc()).toBe('BC: 7,8')

    // @ts-expect-error Testing type error
    expect(() => f2(obj).ab()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).cd()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ad()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bd()).toThrow()
  })

  test('should have only cd on {c,d}', () => {
    const obj = { c: 9, d: 10 }
    expect(f2(obj).cd()).toBe('CD: 9,10')
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ab()).toThrow()

    // @ts-expect-error Testing type error
    expect(() => f2(obj).bc()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ad()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bd()).toThrow()
  })

  test('should have only ac on {a,c}', () => {
    const obj = { a: 11, c: 12 }
    expect(f2(obj).ac()).toBe('AC: 11,12')

    // @ts-expect-error Testing type error
    expect(() => f2(obj).ab()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bc()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).cd()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bd()).toThrow()
  })

  test('should have only bd on {b,d}', () => {
    const obj = { b: 13, d: 14 }
    expect(f2(obj).bd()).toBe('BD: 13,14')
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ab()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bc()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).cd()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ac()).toThrow()
  })

  test('should have only ad on {a,d}', () => {
    const obj = { a: 15, d: 16 }
    expect(f2(obj).ad()).toBe('AD: 15,16')
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ab()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bc()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).cd()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).ac()).toThrow()
    // @ts-expect-error Testing type error
    expect(() => f2(obj).bd()).toThrow()
  })
})
