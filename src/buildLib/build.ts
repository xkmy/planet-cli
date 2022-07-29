import buildUmd from '../config/rollup'
import { copyLess, lessToCss, buildCjs, buildEsm } from '../config/gulp'
import { logger, compose } from '../utils'
import { CJS, ESM, COPY_LESS, LESS_TO_CSS, UMD, BUILD_TYPES } from '../constants'
import { BuildFn, BuildLibKeys } from './types'
import { BuildOptions } from '../types'
import buildTypes from '../config/type'

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
    logger.info('Less to CSS start...')
    await lessToCss({
      entry: ctx.entry,
      mode: ctx.mode,
      outDirUmd: ctx.outDirUmd,
      outDirCjs: ctx.outDirCjs,
      outDirEsm: ctx.outDirEsm
    })
    logger.success('Less to CSS completed')
    next()
  },
  [COPY_LESS]: async (ctx, next) => {
    logger.info('Copy Less start...')
    await copyLess({
      entry: ctx.entry,
      mode: ctx.mode,
      outDirUmd: ctx.outDirUmd,
      outDirEsm: ctx.outDirEsm,
      outDirCjs: ctx.outDirCjs
    })
    logger.success('Copy Less completed')
    next()
  },
  [BUILD_TYPES]: async (ctx, next) => {
    logger.info('Build types start...')
    await buildTypes({
      tsConfigPath: ctx.tsConfigPath,
      outDirTypes: ctx.outDirTypes
    })
    logger.success('Build types completed')
    next()
  }
}

const build = async (params: BuildOptions) => {
  const { mode, lessToCss, copyLess, tsConfigPath } = params

  const buildFns: BuildFn[] = []

  for (const key in bulidLibFns) {
    if (key === mode) buildFns.push(bulidLibFns[key])
  }

  if (lessToCss) {
    buildFns.push(bulidLibFns[LESS_TO_CSS])
  }

  if (copyLess) {
    buildFns.push(bulidLibFns[COPY_LESS])
  }

  if (tsConfigPath) {
    buildFns.push(bulidLibFns[BUILD_TYPES])
  }

  compose(buildFns, params)
}

export default build
