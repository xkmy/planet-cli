import path from 'path'
import { InputOptions, OutputOptions } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import cssnao from 'cssnano'
import { BuildOptions } from 'types'
import { logger, clearDir } from '../../utils'
const rollup = require('rollup')

type Options = Pick<BuildOptions, 'entryUmd' | 'outDirUmd' | 'outputName'>

const getProjectPath = (dir = './'): string => {
  return path.join(process.cwd(), dir);
}

const buildUmd = async ({
  entryUmd,
  outDirUmd,
  outputName
}: Options) => {

  const inputOptions: InputOptions = {
    input: getProjectPath(entryUmd),
    plugins: [
      resolve(),
      commonjs({ include: /node_modules/ }),
      postcss({
        plugins: [cssnao()],
        extensions: ['.css', '.less'],
        extract: 'index.css'
      }),
      babel({
        exclude: '/node_modules/**',
        babelHelpers: 'runtime',
        plugins: ['@babel/plugin-transform-runtime']
      }),
      typescript()
    ],
    external: ['react', 'react-dom']
  }

  const outputOptions: OutputOptions = {
    file: outputName,
    format: 'umd',
    name: getProjectPath(outDirUmd),
  }

  try {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
  } catch (error) {
    logger.error('UMD Build failed' + error)
  }

}

const build = async (options: Options) => {
  await clearDir(options.outDirUmd)
  await buildUmd(options)
}

export default build
