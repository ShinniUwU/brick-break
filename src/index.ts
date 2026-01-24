import { spawn } from 'child_process'
import path from 'path'

const sound = path.join(__dirname, '..', 'sound.mp3')

let lastPlayed = 0
const cooldown = 3000 // don't spam the sound

export function playSound() {
  const now = Date.now()
  if (now - lastPlayed < cooldown) return
  lastPlayed = now

  const p = process.platform

  if (p === 'darwin') {
    spawn('afplay', [sound])
  } else if (p === 'win32') {
    spawn('powershell', ['-c', `(New-Object Media.SoundPlayer '${sound}').PlaySync()`])
  } else {
    const player = spawn('paplay', [sound])
    player.on('error', () => spawn('aplay', [sound]))
  }
}

// patterns that indicate an error
const errorPatterns = [
  /\u{2A2F}/u,           // ⨯ (nextjs error)
  /error(\[|:|\s)/i,     // error: or error[ or error
  /failed/i,
  /exception/i,
  /panic/i,              // rust/go
  /cannot find/i,
  /not found/i,
  /undefined/i,
  /compilation failed/i,
]

function hasError(text: string): boolean {
  return errorPatterns.some(p => p.test(text))
}

export function runCommand(args: string[]) {
  const cmd = args[0]
  const rest = args.slice(1)

  const proc = spawn(cmd, rest, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  })

  proc.stdout?.on('data', (data: Buffer) => {
    const text = data.toString()
    process.stdout.write(text)
    if (hasError(text)) playSound()
  })

  proc.stderr?.on('data', (data: Buffer) => {
    const text = data.toString()
    process.stderr.write(text)
    if (hasError(text)) playSound()
  })

  proc.on('close', code => {
    if (code !== 0) playSound()
    process.exit(code ?? 1)
  })

  proc.on('error', err => {
    console.error(`failed to run: ${err.message}`)
    playSound()
    process.exit(1)
  })
}
