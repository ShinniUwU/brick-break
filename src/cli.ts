#!/usr/bin/env node
import { runCommand } from './index'

const args = process.argv.slice(2)

if (!args.length) {
  console.log('usage: bb <command>')
  console.log('example: bb npm run build')
  process.exit(1)
}

// detect next.js dev mode
const isNextDev = args.some(a => a.includes('next')) && args.some(a => a === 'dev')

if (isNextDev) {
  console.log('\x1b[36m')
  console.log('brick-break: for hmr error sounds, add to your layout.tsx:')
  console.log('')
  console.log("  import { BrickBreak } from 'brick-break/next'")
  console.log('')
  console.log('  // then add <BrickBreak /> inside <body>')
  console.log('\x1b[0m')
}

runCommand(args)
