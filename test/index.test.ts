import { describe, expect, test } from 'bun:test'
import { createFormatter, type FormatterDef } from '../src'

const commonFormatters = {
  // biome-ignore lint/suspicious/noExplicitAny: for all types
  isType: (value): value is any => value !== null && value !== undefined,
  formatters: {
    /**
     * Formats an object as a JSON string.
     * @example
     * const data = { name: 'John', age: 30 }
     * f(data).json() === '{"name":"John","age":30}'
     * @param options - Optional formatting options.
     * @param options.pretty - If true, formats the JSON with indentation.
     */
    json(value, options?: { pretty?: boolean }) {
      return JSON.stringify(value, null, options?.pretty ? 2 : 0)
    },
  },
  // biome-ignore lint/suspicious/noExplicitAny: for all types
} satisfies FormatterDef<any>

const dateFormatter = {
  isType: (value): value is Date => value instanceof Date,
  formatters: {
    /**
     * Formats the date as an ISO string.
     * @example
     * f(new Date(2023, 9, 1)).iso() == '2023-10-01T12:00:00.000Z' // true
     */
    iso(value) {
      return value.toISOString()
    },

    /**
     * Formats the date as a UTC string.
     * @example
     * f(new Date(2023, 9, 1)).utc() == 'Sun, 01 Oct 2023 12:00:00 GMT' // true
     */
    utc(value) {
      return value.toUTCString()
    },

    /**
     * Formats the date as a local string with full date and time.
     * @example
     * f(new Date(2023, 9, 1)).local() == 'Sunday, October 1, 2023 at 12:00:00 PM' // true
     */
    local(value, options?: { timeZone?: string }) {
      return new Intl.DateTimeFormat('default', {
        timeZone: options?.timeZone ?? 'UTC',
        dateStyle: 'full',
        timeStyle: 'long',
      }).format(value)
    },
  },
} satisfies FormatterDef<Date>

const numberFormatter = {
  isType: (value): value is number =>
    typeof value === 'number' && !Number.isNaN(value),
  formatters: {
    /**
     * Formats the number as a string with two decimal places.
     * @example
     * f(123.456).decimal() // '123.46'
     */
    decimal(value) {
      return value?.toFixed(2)
    },

    /**
     * Formats the number as a currency string.
     * @example
     * f(123.456).currency() // '$123.46'
     */
    currency(value, currency: string = 'USD') {
      return new Intl.NumberFormat('default', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    },

    ms(value) {
      return new Intl.NumberFormat('default', {
        style: 'unit',
        unit: 'millisecond',
        unitDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value / 1000)
    },
  },
} satisfies FormatterDef<number>

const f = createFormatter([dateFormatter, commonFormatters, numberFormatter])

describe('createFormatter', () => {
  test('should return a function that formats values based on their type', () => {
    expect(typeof f).toBe('function')
  })

  test('should format Date values correctly', () => {
    const date = new Date(2023, 9, 1)
    expect(f(date).iso()).toBe('2023-10-01T00:00:00.000Z')
  })

  test('should format numbers correctly', () => {
    const num = 123.456
    expect(f(num).decimal()).toBe('123.46')
    expect(f(num).currency()).toBe('$123.46')
    expect(f(num).ms()).toBe('0 ms')
    expect(f(num).json()).toBe('123.456')
    f(num).json()
  })

  test('should format objects as JSON', () => {
    const obj = { name: 'John', age: 30 }
    expect(f(obj).json()).toBe('{"name":"John","age":30}')
    expect(f(obj).json({ pretty: true })).toBe(
      '{\n  "name": "John",\n  "age": 30\n}',
    )
  })
})
test('should handle undefined and null values', () => {
  expect(f(undefined).json()).toBe('null')
  expect(f(null).json()).toBe('null')
})
test('should handle empty objects and arrays', () => {
  expect(f({}).json()).toBe('{}')
  expect(f([]).json()).toBe('[]')
})

test('should handle nested objects', () => {
  const nestedObj = { user: { name: 'Alice', age: 25 }, active: true }
  expect(f(nestedObj).json()).toBe(
    '{"user":{"name":"Alice","age":25},"active":true}',
  )
})

test('should handle special number values', () => {
  expect(f(Infinity).json()).toBe('Infinity')
  expect(f(-Infinity).json()).toBe('-Infinity')
  expect(f(NaN).json()).toBe('NaN')
})

test('should handle empty strings', () => {
  expect(f('').json()).toBe('""')
})

test('should handle boolean values', () => {
  expect(f(true).json()).toBe('true')
  expect(f(false).json()).toBe('false')
})

test('should handle functions', () => {
  const func = () => 'Hello, World!'
  expect(f(func).json()).toBe(func.toString())
})

test('should handle symbols', () => {
  const sym = Symbol('test')
  expect(f(sym).json()).toBe(sym.toString())
})
