import { copyLess, lessToCss, buildCjs, buildEsm } from '../config/gulp'
import { logger, compose } from '../utils'
import { CJS, ESM, COPY_LESS, LESS_TO_CSS } from '../constants'
import { BuildFn, BuildLibKeys } from './types'
import { BuildOptions } from 'types'

const bulidLibFns: { [key in BuildLibKeys]: BuildFn } = {
  [LESS_TO_CSS]: async (ctx, next) => {
    logger.info('less to css ing...')
    await lessToCss({
      outDirCjs: ctx.outDirCjs,
      entry: ctx.entry,
      mode: ctx.mode,
      outDirEsm: ctx.outDirEsm
    })
    logger.success('less to css computed')
    next()
  },
  [COPY_LESS]: async (ctx, next) => {
    logger.info('copyLess ing...')
    await copyLess({
      outDirCjs: ctx.outDirCjs,
      entry: ctx.entry,
      mode: ctx.mode,
      outDirEsm: ctx.outDirEsm
    })
    logger.success('copyLess computed')
    next()
  },
  // [UMD]: async (next, ctx) => {
  //   await buildUmd({
  //     analyzerUmd: ctx.analyzerUmd,
  //     outDirUmd: ctx.outDirUmd,
  //     entry: ctx.entry,
  //     outputName: ctx.outputName
  //   })
  //   next()
  // },
  [CJS]: async (ctx, next) => {
    logger.info('buildCJS ing...')
    await buildCjs({
      mode: ctx.mode,
      outDirCjs: ctx.outDirCjs,
      entry: ctx.entry
    })
    logger.success('buildCJS computed')
    next()
  },
  [ESM]: async (ctx, next) => {
    logger.info('buildESM ing...')
    await buildEsm({
      mode: ctx.mode,
      outDirEsm: ctx.outDirEsm,
      entry: ctx.entry
    })
    logger.success('buildESM computed')
    next()
  }
}

const build = async (params: BuildOptions) => {
  console.log('params', params)

  const buildFns: BuildFn[] = []

  for (const key in bulidLibFns) {
    if (Object.prototype.hasOwnProperty.call(bulidLibFns, key)) {
      if (key === params.mode) buildFns.push(bulidLibFns[key])
    }
  }

  compose(buildFns, params)
}

export default build