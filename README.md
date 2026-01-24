# 🧱 brick-break

> *that satisfying lego break sound when your build fails*

saw this idea on tiktok and had to make it real. now every failed build hits different.

## install

```bash
npm i -D brick-break
```

then wrap your build command:

```json
{
  "scripts": {
    "dev": "brick-break next dev",
    "build": "brick-break next build"
  }
}
```

or just run it directly:

```bash
npx brick-break next build
```

## works with everything

```bash
brick-break next build
brick-break npm run build
brick-break tsc
brick-break cargo build
brick-break go build
```

if it can fail, brick-break can make it funnier.

## how it works

1. runs your command
2. build fails? plays the sound
3. thats it

## requirements

uses your system audio player (already installed):
- **mac** - afplay
- **linux** - paplay/aplay
- **windows** - powershell

## license

MIT
