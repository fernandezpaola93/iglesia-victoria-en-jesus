import { rmSync } from 'node:fs'

// Next.js can fail to clean pnpm symlinks inside this generated directory on Windows.
rmSync('.next/standalone', { recursive: true, force: true })
