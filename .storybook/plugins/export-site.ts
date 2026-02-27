/**
 * Vite plugin for the "Export Site" feature in Storybook.
 *
 * Server-side: exposes POST /__export-site endpoint.
 * Runs the export CLI script and streams output back.
 */

import { existsSync } from 'fs'
import { resolve } from 'path'
import { exec } from 'child_process'
import type { Plugin, ViteDevServer } from 'vite'

export function exportSitePlugin(): Plugin {
  let root: string

  return {
    name: 'storybook-export-site',
    configureServer(server: ViteDevServer) {
      root = server.config.root

      // Lightweight check: does the output path already have an exported site?
      server.middlewares.use('/__export-site-check', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { outputDir } = JSON.parse(body) as { outputDir: string }
            const absOutput = resolve(root, outputDir)
            const engineJsonPath = resolve(absOutput, '.engine.json')
            const exists = existsSync(engineJsonPath)

            let presetId: string | null = null
            if (exists) {
              try {
                const data = JSON.parse(require('fs').readFileSync(engineJsonPath, 'utf-8'))
                presetId = data.presetId ?? null
              } catch { /* ignore */ }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ exists, presetId }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // Export endpoint: runs the full export/update
      server.middlewares.use('/__export-site', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { presetId, outputDir } = JSON.parse(body) as {
              presetId: string
              outputDir: string
            }

            if (!presetId || !outputDir) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'presetId and outputDir are required' }))
              return
            }

            // Resolve to absolute path
            const absOutput = resolve(root, outputDir)

            // Auto-detect update mode: if .engine.json exists, use --update
            const engineJsonPath = resolve(absOutput, '.engine.json')
            const isUpdate = existsSync(engineJsonPath)

            // Build CLI args
            const args = [presetId, '--output', absOutput]
            if (isUpdate) args.push('--update')

            // Quote args for shell safety
            const quotedArgs = args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ')
            const cmd = `npx tsx --require ./scripts/export/css-noop.cjs scripts/export-site.ts ${quotedArgs}`

            console.info(`[export-site] Running: ${cmd}`)

            exec(cmd, { cwd: root, timeout: 120_000 }, (error, stdout, stderr) => {
              if (error) {
                console.error('[export-site] Error:', stderr || error.message)
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  error: stderr || error.message,
                  output: stdout,
                  isUpdate,
                }))
                return
              }

              console.info(`[export-site] Success: exported to ${absOutput}`)
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                ok: true,
                output: stdout,
                outputDir: absOutput,
                isUpdate,
              }))
            })
          } catch (err) {
            console.error('[export-site] Parse error:', err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })
    },
  }
}
