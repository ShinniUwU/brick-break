#!/usr/bin/env node
import { runCommand } from './index'
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const args = process.argv.slice(2)

if (!args.length) {
  console.log('usage: bb <command>')
  console.log('       bb init  - setup next.js hmr support')
  console.log('example: bb npm run build')
  process.exit(1)
}

// handle init command
if (args[0] === 'init') {
  const layoutPaths = [
    join(process.cwd(), 'app/layout.tsx'),
    join(process.cwd(), 'src/app/layout.tsx'),
    join(process.cwd(), 'app/layout.jsx'),
    join(process.cwd(), 'src/app/layout.jsx'),
  ]

  const layoutPath = layoutPaths.find(p => existsSync(p))

  if (!layoutPath) {
    console.log('\x1b[31merror: no layout.tsx found\x1b[0m')
    console.log('make sure you are in a next.js project root')
    process.exit(1)
  }

  let content = readFileSync(layoutPath, 'utf-8')

  if (content.includes('brick-break')) {
    console.log('\x1b[33mbrick-break already installed in layout\x1b[0m')
    process.exit(0)
  }

  // add import at the top (after other imports or 'use client')
  const importLine = "import { BrickBreak } from 'brick-break/next'\n"

  if (content.includes("'use client'") || content.includes('"use client"')) {
    content = content.replace(/(["']use client["'][\s\n]*)/, `$1${importLine}`)
  } else if (content.includes('import ')) {
    content = content.replace(/(import .+\n)/, `${importLine}$1`)
  } else {
    content = importLine + content
  }

  // add <BrickBreak /> after <body> or <body ...>
  content = content.replace(/(<body[^>]*>)(\s*)/, '$1$2<BrickBreak />\n        ')

  writeFileSync(layoutPath, content)
  console.log('\x1b[32m✓ added BrickBreak to ' + layoutPath + '\x1b[0m')

  // install brick-break as a local dev dependency so the import resolves
  const pkgPath = join(process.cwd(), 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    if (!deps['brick-break']) {
      const cwd = process.cwd()
      let cmd: string
      if (existsSync(join(cwd, 'bun.lock')) || existsSync(join(cwd, 'bun.lockb'))) {
        cmd = 'bun add -d brick-break'
      } else if (existsSync(join(cwd, 'pnpm-lock.yaml'))) {
        cmd = 'pnpm add -D brick-break'
      } else if (existsSync(join(cwd, 'yarn.lock'))) {
        cmd = 'yarn add -D brick-break'
      } else {
        cmd = 'npm install -D brick-break'
      }
      console.log(`\x1b[36minstalling brick-break locally...\x1b[0m`)
      try {
        execSync(cmd, { cwd, stdio: 'inherit' })
      } catch {
        console.log(`\x1b[31mfailed to install. run manually: ${cmd}\x1b[0m`)
      }
    }
  }

  console.log('hmr errors will now play the sound')
  process.exit(0)
}

// detect next.js dev mode - show hint if not already setup
const isNextDev = args.some(a => a.includes('next')) && args.some(a => a === 'dev')

if (isNextDev) {
  const layoutPaths = [
    join(process.cwd(), 'app/layout.tsx'),
    join(process.cwd(), 'src/app/layout.tsx'),
    join(process.cwd(), 'app/layout.jsx'),
    join(process.cwd(), 'src/app/layout.jsx'),
  ]
  const layoutPath = layoutPaths.find(p => existsSync(p))
  const alreadySetup = layoutPath && readFileSync(layoutPath, 'utf-8').includes('brick-break')

  if (!alreadySetup) {
    console.log('\x1b[36m')
    console.log('brick-break: for hmr error sounds, run: bb init')
    console.log('\x1b[0m')
  }
}

runCommand(args)
