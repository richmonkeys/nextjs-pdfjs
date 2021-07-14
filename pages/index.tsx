import { FormEvent, useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'

const mimetype = 'application/pdf'

export default function Home() {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseJson, setResponseJson] = useState<string>()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    setResponseJson(undefined)
    const body = new FormData()
    body.append('pdf', file)
    const response = await fetch('/api/pdf', {
      method: 'POST',
      body,
    })
    setResponseJson(await response.json())
    setIsSubmitting(false)
  }

  const createPreview = async () => {
    if (!file?.name || file?.type !== mimetype) {
      return
    }

    const arrayBuffer = await file.arrayBuffer()
    const typedArray = new Uint8Array(arrayBuffer)
    const pdf = await pdfjsLib.getDocument(typedArray).promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 1 })

    canvasRef.current.height = viewport.height
    canvasRef.current.width = viewport.width

    await page.render({
      canvasContext: canvasRef.current.getContext('2d'),
      viewport,
    }).promise

    imgRef.current.src = canvasRef.current.toDataURL()
  }

  useEffect(() => {
    createPreview()
  }, [file?.arrayBuffer])

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(new URL('pdfjs-dist/build/pdf.worker', import.meta.url))
  }, [])

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file"
          accept={mimetype}
          onChange={event => setFile(event.currentTarget.files[0])}
        />
        <button type="submit">Submit</button>
      </form>

      {responseJson ? (
        <>
        <p>Response:</p>
        <pre>{JSON.stringify(responseJson, null, 2)}</pre>
        </>
      ) : null}

      {!file?.name ? (
        <p>Please choose a PDF file to show preview.</p>
      ) : null}

      <div style={{ display: file?.name ? 'flex' : 'none' }}>
        <div>
          <p>Preview using img:</p>
          <img alt="pdf preview" ref={imgRef} />
        </div>
        <div>
          <p>Preview using canvas:</p>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}