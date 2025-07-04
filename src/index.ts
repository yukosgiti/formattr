import type { GetTypeGuardType, UnionToIntersection } from './types'

export type FormatterDef<T> = {
	isType: (value: any) => value is T
	formatters: Record<string, (value: T, options?: any) => string>
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
	): U extends GetTypeGuardType<T[number]['isType']> ? W : never => {
		const output = formatters
			.filter((f) => f.isType(value))
			.map((f) => f.formatters)
			.reduce((acc, curr) => ({ ...acc, ...curr }), {})

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
