import path from 'path'
import rollup from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import cssnao from 'cssnano'
import { BuildOptions } from 'types'

const buildUmd = async ({
  outDirUmd,
  entry,
  outputName
}: Pick<BuildOptions, 'outDirUmd' | 'entry' | 'outputName'>) => {

  rollup.defineConfig([
    {
      input: path.join(__dirname, entry),
      output: [
        {
          file: outputName,
          format: 'umd',
          name: outDirUmd
        }
      ],
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
  ])

}

export { buildUmd }
