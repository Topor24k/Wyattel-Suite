import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import enquiryHandler from './api/enquiry.js'

export default defineConfig(({ mode }) => {
  // Server-only mail credentials never enter the browser bundle.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['RESEND_API_KEY', 'RESERVATION_TO_EMAIL', 'RESERVATION_FROM_EMAIL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }
  return {
    plugins: [react(), {
      name: 'wyattel-enquiry-api',
      configureServer(server) {
        server.middlewares.use('/api/enquiry', async (req, res) => {
          const chunks = []; let length = 0
          for await (const chunk of req) {
            length += chunk.length
            if (length > 131072) { res.statusCode = 413; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ message: 'This enquiry is too large.' })); return }
            chunks.push(chunk)
          }
          req.body = Buffer.concat(chunks).toString()
          res.status = code => { res.statusCode = code; return res }
          res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); return res }
          try { await enquiryHandler(req, res) } catch { res.status(500).json({ message: 'Your enquiry was not sent. Please contact the hotel.' }) }
        })
      },
    }],
  }
})
