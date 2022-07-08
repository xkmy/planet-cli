import build from './build'
import { BUILD } from '../constants'
import { Command } from 'commander'

export const buildLib = (commander: Command) => {
  commander
    .command(BUILD)
    .description('打包编译仓库')
    .option('-a, --analyzerUmd', '是否启用webpack打包分析器')
    .option('-e, --entry <path>', 'umd打包路径入口文件', './src/index')
    .option('--output-name <name>', '打包Umd格式后对外暴露的名称','dist/index.js')
    .option('--entry <path>', 'cjs和esm打包路径入口目录', './src')
    .option('--out-dir-umd <path>', '输出umd格式的目录', './dist')
    .option('--out-dir-esm <path>', '输出esm格式的目录', './esm')
    .option('--out-dir-cjs <path>', '输出cjs格式的目录', './lib')
    .option('--less-to-css', '是否编译组件样式', true)
    .option('--copy-less', '拷贝不参与编译的文件')
    .option('-m, --mode <umd|cjs|esm>', '打包模式 支持umd,cjs和esm')
    .action(build)
}

export * from './types'