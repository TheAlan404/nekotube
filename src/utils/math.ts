export const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));
export const rand = (x = 1) => Math.floor(Math.random() * x);
export const randArr = <T,>(x: T[]) => x[rand(x.length)];

