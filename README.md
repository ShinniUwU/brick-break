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

## global install (recommended for non-js projects)

```bash
npm i -g brick-break
```

now you can use `bb` anywhere:

```bash
bb cargo build
bb go build
bb pytest
bb make
```

## works with everything

```bash
bb next build
bb npm run build
bb tsc
bb cargo build
bb go build
```

if it can fail, brick-break can make it funnier.

## next.js hmr support

for errors that happen while the dev server is running (hot reload), add the component to your layout:

```tsx
// app/layout.tsx
import { BrickBreak } from 'brick-break/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BrickBreak />
        {children}
      </body>
    </html>
  )
}
```

now errors play the sound even during hot reload.

## how it works

1. runs your command
2. build fails? plays the sound
3. thats it

(for next.js hmr: watches for the error overlay in the browser)

## requirements

uses your system audio player (already installed):
- **mac** - afplay
- **linux** - paplay/aplay
- **windows** - powershell

## license

MIT
