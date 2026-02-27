/**
 * GrainOverlay — Canvas-based film grain effect.
 *
 * 256×256 pixel noise texture tiled at 8fps with mix-blend-overlay.
 * Pointer-events: none, z-100, fixed over entire viewport.
 */

import { useEffect, useRef } from 'react'

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = 256
    const h = 256
    canvas.width = w
    canvas.height = h

    let animId: number
    let lastTime = 0
    const fps = 8
    const interval = 1000 / fps

    const drawGrain = (time: number) => {
      animId = requestAnimationFrame(drawGrain)
      if (time - lastTime < interval) return
      lastTime = time

      const imageData = ctx.createImageData(w, h)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 18
      }
      ctx.putImageData(imageData, 0, 0)
    }

    animId = requestAnimationFrame(drawGrain)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100] w-full h-full opacity-60 mix-blend-overlay"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
