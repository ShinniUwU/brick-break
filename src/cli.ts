#!/usr/bin/env node
import { runCommand } from './index'

const args = process.argv.slice(2)

if (!args.length) {
  console.log('usage: bb <command>')
  console.log('example: bb npm run build')
  process.exit(1)
}

runCommand(args)
