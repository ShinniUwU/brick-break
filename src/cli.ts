#!/usr/bin/env node
import { runCommand } from './index'

const args = process.argv.slice(2)

if (!args.length) {
  console.log('usage: brick-break <command>')
  console.log('example: brick-break npm run build')
  process.exit(1)
}

runCommand(args)
