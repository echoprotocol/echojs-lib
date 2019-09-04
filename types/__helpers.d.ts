export type OnlyKeys<T, U> = { [K in keyof T]: U extends T[K] ? K : never }[keyof T]
export type OnlyUndefined<T> = { [K in OnlyKeys<T, undefined>]: T[K] }
export type ExcludeKeys<T, U> = { [K in keyof T]: U extends T[K] ? never : K }[keyof T]
export type ExcludeUndefined<T> = { [K in ExcludeKeys<T, undefined>]: T[K] }
export type Optional<T> = { [K in keyof T]?: T[K] }
export type UndefinedOptional<T> = ExcludeUndefined<T> & Optional<OnlyUndefined<T>>
export type OptionalFee<T, FeeField = 'fee'> = FeeField extends keyof T ? ExcludeKeys<T, FeeField> & T[FeeField] : T;
