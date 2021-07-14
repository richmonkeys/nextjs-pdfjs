import parseBody, { BusboyFile } from '@richmonkeys/parse-body'
import { NextApiRequest, NextApiResponse } from 'next'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

export const config = { api: { bodyParser: false } }

type PostBody = {
  pdf: BusboyFile
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Only POST requests is allowed.')
  }

  const body: PostBody = await parseBody(req)

  if (!(body?.pdf instanceof BusboyFile)) {
    return res.status(400).end('Multipart/form-data "pdf" of type "file" is required.')
  }

  const pdf = await pdfjsLib.getDocument(body.pdf.data).promise
  
  res.send({
    numPages: pdf.numPages,
  })
}