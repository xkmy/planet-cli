import gulp from 'gulp'
import babel from 'gulp-babel'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'
import through2 from 'through2'
import esConfig from '../babel/es'
import cjsConfig from '../babel/lib'
import { clearDir, getProjectPath } from '../../utils'
import { CJS, ESM, LIB } from '../../constants'
import { BuildOptions, Mode } from '../../types'

type Options = Pick<BuildOptions, 'entry' | 'mode'>

const paths = {
  dest: {
    lib: getProjectPath(LIB),
    esm: getProjectPath(ESM)
  },
  styles: (path: string) => getProjectPath(`${path}/**/*.less`),
  scripts: (path: string) => [
    getProjectPath(`${path}/**/*.{ts,tsx,js,jsx}`),
    getProjectPath(`!${path}/**/__tests__/*.{ts,tsx,js,jsx}`)
  ]
}

function cssInjection(content: string) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, '.css')
}

/**
 * 编译脚本文件
 * @param {Mode} mode babel环境变量
 * @param {string} destDir 目标目录
 * @param {string} entry 入口目录
 */
function compileScripts(mode: Mode, destDir: string, entry: string) {
  const { scripts } = paths
  return gulp
    .src(scripts(entry))
    .pipe(babel(mode === ESM ? esConfig : cjsConfig))
    .pipe(
      through2.obj(function fn(file, encoding: string, next: () => void) {
        this.push(file.clone())
        console.log('content', file.path)
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding)
          // 处理文件内容
          file.contents = Buffer.from(cssInjection(content))
          // 重命名
          file.path = file.path.replace(/index\.js/, 'css.js')
          this.push(file)
          next()
        } else {
          next()
        }
      })
    )
    .pipe(gulp.dest(destDir))
}

const getRealEntry = (entry: string) => {
  return entry?.[entry.length - 1] === '/' ? entry.slice(0, entry.length - 1) : entry
}

const copyLess = ({
  entry,
  mode,
  outDirCjs,
  outDirEsm
}: Options & Pick<BuildOptions, 'outDirCjs' | 'outDirEsm'>) => {
  gulp.task('copyLess', () => {
    const source = gulp.src(paths.styles(getRealEntry(entry)))
    if (mode === CJS) {
      source.pipe(gulp.dest(outDirCjs))
    }
    if (mode === ESM) {
      source.pipe(gulp.dest(outDirEsm))
    }
    return source
  })

  return new Promise(res => {
    return gulp.series('copyLess', () => {
      res(true)
    })()
  })
}

const lessToCss = ({
  entry,
  mode,
  outDirCjs,
  outDirEsm
}: Options & Pick<BuildOptions, 'outDirCjs' | 'outDirEsm'>) => {
  gulp.task('lessToCss', () => {
    const source = gulp
      .src(paths.styles(getRealEntry(entry)))
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(cssnano({ zindex: false, reduceIdents: false }))
    if (mode === CJS) {
      source.pipe(gulp.dest(outDirCjs))
    }
    if (mode === ESM) {
      source.pipe(gulp.dest(outDirEsm))
    }
    return source
  })

  return new Promise(res => {
    return gulp.series('lessToCss', () => {
      res(true)
    })()
  })
}

const buildCjs = async ({ entry, mode, outDirCjs }: Options & Pick<BuildOptions, 'outDirCjs'>) => {
  await clearDir(outDirCjs)

  gulp.task('compileCJS', () => {
    return compileScripts(mode, outDirCjs, getRealEntry(entry))
  })

  return new Promise(res => {
    return gulp.series('compileCJS', () => {
      res(true)
    })()
  })
}

const buildEsm = async ({ entry, mode, outDirEsm }: Options & Pick<BuildOptions, 'outDirEsm'>) => {
  await clearDir(outDirEsm)

  gulp.task('compileESM', () => {
    return compileScripts(mode, outDirEsm, getRealEntry(entry))
  })

  return new Promise(res => {
    return gulp.series('compileESM', () => {
      res(true)
    })()
  })
}

export { copyLess, lessToCss, buildCjs, buildEsm }
