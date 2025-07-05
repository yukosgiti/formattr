/** biome-ignore-all lint/suspicious/noExplicitAny: Library */
import type { RemoveFirstParameter, UnionToIntersection } from './types'

export type FormatterDef<T> = {
  isType: (value: any) => value is T
  formatters: Record<string, (value: T, options?: any) => string>
  fallbackString?: string
}

export function createFormatter<T extends FormatterDef<any>[]>(formatters: T) {
  return <
    U,
    W extends UnionToIntersection<
      Extract<
        T[number]['formatters'],
        Record<string, (value: U, option?: any) => any>
      >
    >,
  >(
    value: U,
  ): RemoveFirstParameter<W, U> => {
    const items = formatters
      .filter((f) => f.isType(value))
      .map((f) => f.formatters)
      .flatMap((f) => Object.entries(f))

    if (items.length === 0) {
      throw new Error(`No formatters found for value of type ${typeof value}`)
    }

    const output = Object.fromEntries(items)
    // _.partial(output) // Ensure all functions are partial
    Object.keys(output).forEach((key) => {
      const original = output[key]
      output[key] = (...args: any[]) => {
        return original(value, ...args)
      }
    })
    return output as any
  }
}
