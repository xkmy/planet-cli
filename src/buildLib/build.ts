import buildUmd from '../config/rollup'
import { copyLess, lessToCss, buildCjs, buildEsm } from '../config/gulp'
import { logger, compose } from '../utils'
import { CJS, ESM, COPY_LESS, LESS_TO_CSS, UMD } from '../constants'
import { BuildFn, BuildLibKeys } from './types'
import { BuildOptions } from '../types'

const bulidLibFns: { [key in BuildLibKeys]: BuildFn } = {
  [UMD]: async (ctx, next) => {
    logger.info('Start building UMD...')
    await buildUmd({
      outDirUmd: ctx.outDirUmd,
      entryUmd: ctx.entryUmd,
      outputName: ctx.outputName
    })
    logger.success('UMD build completed')
    next()
  },
  [CJS]: async (ctx, next) => {
    logger.info('Start building CJS...')
    await buildCjs({
      mode: ctx.mode,
      outDirCjs: ctx.outDirCjs,
      entry: ctx.entry
    })
    logger.success('CJS build completed')
    next()
  },
  [ESM]: async (ctx, next) => {
    logger.info('Start building ESM...')
    await buildEsm({
      mode: ctx.mode,
      outDirEsm: ctx.outDirEsm,
      entry: ctx.entry
    })
    logger.success('ESM build completed')
    next()
  },
  [LESS_TO_CSS]: async (ctx, next) => {
    logger.info(' Less to CSS start...')
    await lessToCss({
      outDirCjs: ctx.outDirCjs,
      entry: ctx.entry,
      mode: ctx.mode,
      outDirEsm: ctx.outDirEsm
    })
    logger.success('Less to CSS completed')
    next()
  },
  [COPY_LESS]: async (ctx, next) => {
    logger.info('Copy Less start...')
    await copyLess({
      outDirCjs: ctx.outDirCjs,
      entry: ctx.entry,
      mode: ctx.mode,
      outDirEsm: ctx.outDirEsm
    })
    logger.success('Copy Less completed')
    next()
  }
}

const build = async (params: BuildOptions) => {
  const buildFns: BuildFn[] = []

  for (const key in bulidLibFns) {
    if (Object.prototype.hasOwnProperty.call(bulidLibFns, key)) {
      if (key === params.mode) buildFns.push(bulidLibFns[key])
    }
  }

  compose(buildFns, params)
}

export default build
