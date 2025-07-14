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
export type RemoveFirstParameter<W, U> = W extends Record<
  string,
  (value: U, option?: any) => any
>
  ? {
      [K in keyof W]: W[K] extends (
        value: U,
        ...args: infer A
      ) => ReturnType<W[K]>
        ? (...args: A) => ReturnType<W[K]>
        : W[K] extends (value: U) => any
          ? () => ReturnType<W[K]>
          : never
    }
  : never
