export type ReactiveValue<T> = {value: T}

export const get = <T>({value}: ReactiveValue<T>) => value;
export const set = <T>(obj: ReactiveValue<T>, v: T) => obj.value = v;