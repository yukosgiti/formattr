/** biome-ignore-all lint/suspicious/noExplicitAny: This is for library */

export type GetTypeGuardType<T> = T extends (val: any) => val is infer R
	? R
	: never
export type UnionToIntersection<U> = ((k: U) => void) extends (
	k: infer I,
) => void
	? I
	: never
