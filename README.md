# Example on How to Setup [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) with [Next.js](https://nextjs.org/)

## Running this example

```bash
npm i
npm run dev
```

## TL; DR

Install these dependencies:

```bash
npm i pdfjs-dist
npm i -D worker-loader
```

Next.js config: `next.config.js`

```js
// https://nextjs.org/docs/messages/webpack5
module.exports = {
    // Enable webpack5
    webpack5: true,
}
```

Using pdfjs-dist in Next.js Page (frontend):
e.g. `pages/index.jsx`

```jsx
import { useEffect } from 'react'
// Load pdfjs from 'pdfjs-dist/build/pdf' instead of pdfjs-dist/webpack'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'

export default function MyPage() {
  useEffect(() => {
    // Only create a worker in useEffect hook
    const PdfjsWorker = new Worker(new URL('pdfjs-dist/build/pdf.worker', import.meta.url))

    // Assign the worker to pdfjs
    pdfjsLib.GlobalWorkerOptions.workerPort = PdfjsWorker
  }, [])

  return (
    <h1>hello world!</h1>
  )
}
```

Using pdfjs-dist in Next.js API routes (backend): e.g. `pages/api/process-pdf.js`

```js
// Import pdfjs from 'pdfjs-dist/legacy/build/pdf'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
// Set 'workerSrc' instead of 'workerPort' 
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker'

export default async (req, res) => {
    ...
}
```
