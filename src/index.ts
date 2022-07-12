import { Command } from 'commander'

import { buildLib } from './buildLib'

const commander = new Command()

buildLib(commander)

// 解析命令行参数
commander.parse(process.argv)

// 命令行没有参数,显示帮助文档
if (!commander.args.length) {
  commander.help()
}

export * from './types'
