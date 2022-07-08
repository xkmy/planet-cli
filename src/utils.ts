import chalk from 'chalk'
import path from 'path'
import { DEV } from './constants'
import { MiddlewareFn } from './types'

const log = (fn: Function) => {
  return (...msg: string[]): void => {
    console.log(fn(msg))
  }
}

export const logger = {
  success: log(chalk.green),
  error: log(chalk.red),
  warn: log(chalk.yellow),
  info: log(chalk.cyan),
  log: log((msg: string) => msg)
}

export const getProjectPath = (dir = './'): string => {
  return path.join(process.cwd(), dir)
}

export const isDev = env => env === DEV

export function compose<T>(middleware: MiddlewareFn<T>[], ctx: T) {
  function dispatch(index: number) {
    if (index === middleware.length) return
    const currMiddleware = middleware[index]
    return currMiddleware(ctx || ({} as T), () => dispatch(++index))
  }
  dispatch(0)
}
