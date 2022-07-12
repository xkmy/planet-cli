import { CJS, COPY_LESS, ESM, LESS_TO_CSS, UMD } from '../constants'
import { BuildOptions, MiddlewareFn } from '../types'

export type BuildLibKeys = typeof LESS_TO_CSS | typeof COPY_LESS | typeof UMD | typeof CJS | typeof ESM

export type BuildFn = MiddlewareFn<BuildOptions>
