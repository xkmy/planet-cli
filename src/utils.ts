import chalk from 'chalk'
import path from 'path'
import rimraf from 'rimraf'
import { MiddlewareFn } from './types'

const log = (fn: Function) => {
  return (...msg: string[]): void => {
    console.log(fn(msg))
  }
}

export const logger = {
  success: log((msg: string) => chalk.green(msg + '\n')),
  error: log(chalk.red),
  warn: log(chalk.yellow),
  info: log(chalk.cyan),
  log: log((msg: string) => msg)
}

export const getProjectPath = (dir = './'): string => {
  return path.join(process.cwd(), dir)
}

export function compose<T>(middleware: MiddlewareFn<T>[], ctx: T) {
  function dispatch(index: number) {
    if (index === middleware.length) return
    const currMiddleware = middleware[index]
    return currMiddleware(ctx || ({} as T), () => dispatch(++index))
  }
  dispatch(0)
}

export const clearDir = (dir: string) => {
  return new Promise(res => {
    rimraf(getProjectPath(dir), {}, () => {
      res(true)
    })
  })
}
