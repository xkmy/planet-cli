import { exec } from 'child_process'
import { getProjectPath, logger } from '../../utils'
import { promisify } from 'util'
import { BuildOptions } from '../../types'

const buildTypes = async ({
  tsConfigPath,
  outDirTypes
}: Pick<BuildOptions, 'tsConfigPath' | 'outDirTypes'>) => {
  try {
    const path = getProjectPath(tsConfigPath)
    await promisify(exec)(`tsc -p ${path} --outDir ${outDirTypes} -d -noEmit false --emitDeclarationOnly`, {
      cwd: process.cwd(),
      encoding: 'utf8'
    })
  } catch (error) {
    console.log('error', error)
    logger.error('The type file build failed', error)
  }
}

export default buildTypes
