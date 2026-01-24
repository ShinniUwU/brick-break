import { spawn } from 'child_process'
import path from 'path'

const sound = path.join(__dirname, '..', 'sound.mp3')

export function playSound() {
  const p = process.platform

  if (p === 'darwin') {
    spawn('afplay', [sound])
  } else if (p === 'win32') {
    spawn('powershell', ['-c', `(New-Object Media.SoundPlayer '${sound}').PlaySync()`])
  } else {
    // linux - try pulseaudio first, fallback to alsa
    const player = spawn('paplay', [sound])
    player.on('error', () => spawn('aplay', [sound]))
  }
}

export function runCommand(args: string[]) {
  const cmd = args[0]
  const rest = args.slice(1)

  const proc = spawn(cmd, rest, { stdio: 'inherit', shell: true })

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
