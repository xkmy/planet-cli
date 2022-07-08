import { CJS, COPY_LESS, ESM, LESS_TO_CSS } from '../constants'
import { BuildOptions, MiddlewareFn,  } from '../types'

export type BuildLibKeys = typeof LESS_TO_CSS | typeof COPY_LESS | typeof CJS | typeof ESM

export type BuildFn = MiddlewareFn<BuildOptions>
