import { CJS, ESM, LIB, UMD } from './constants'

export type Mode = typeof ESM | typeof CJS | typeof LIB | typeof UMD

export type MiddlewareFn<T> = {
  (ctx: T, next: () => void): Promise<T | undefined | void>
}

export type BuildOptions = {
  entry: string
  mode: Mode
  outputName: string
  outDirCjs?: string
  outDirEsm?: string
  outDirUmd?:string
  copyLess?: string
  lessToCss?: string
  cleanDir?: string
}
