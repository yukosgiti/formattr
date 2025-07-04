/** biome-ignore-all lint/suspicious/noExplicitAny: This is for library */

export type GetTypeGuardType<T> = T extends (val: any) => val is infer R
	? R
	: never
export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never
