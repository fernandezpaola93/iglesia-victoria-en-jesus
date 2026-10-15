import { cpSync, existsSync } from 'node:fs'

const standaloneDir = '.next/standalone'

cpSync('.next/static', `${standaloneDir}/.next/static`, { recursive: true })

if (existsSync('public')) {
  cpSync('public', `${standaloneDir}/public`, { recursive: true })
}
