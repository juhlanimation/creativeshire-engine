/**
 * EffectTimeline - orchestrates parallel animation tracks.
 *
 * A reusable timeline system that can run multiple animation effects
 * in parallel and resolve when ALL tracks complete. Similar to a DAW
 * where multiple audio tracks play simultaneously.
 *
 * @example
 * ```ts
 * const timeline = new EffectTimeline()
 *
 * // Add tracks (each track is a function returning a promise)
 * timeline.addTrack('page-fade', () => animateElement(wrapper, { className: 'fade-out' }))
 * timeline.addTrack('hero-slide', () => animateElement(hero, { className: 'slide-up' }))
 *
 * // Play all tracks in parallel, wait for all to complete
 * await timeline.play()
 *
 * // Navigate after all animations finish
 * router.push('/next-page')
 * ```
 */

// =============================================================================
// Types
// =============================================================================

export interface Track {
  /** Unique identifier for the track */
  id: string
  /** Function that executes the animation and returns a promise */
  execute: () => Promise<void>
}

export interface SequentialTrack extends Track {
  /** Delay in ms to wait before starting this track */
  delay: number
}

// =============================================================================
// EffectTimeline Class
// =============================================================================

export class EffectTimeline {
  private tracks: Track[] = []
  private sequentialTracks: SequentialTrack[] = []
  private isPlaying = false

  /**
   * Add a track to the timeline.
   *
   * @param id - Unique identifier for debugging/logging
   * @param execute - Function that starts the animation and returns a promise
   */
  addTrack(id: string, execute: () => Promise<void>): void {
    // Prevent duplicate track IDs
    if (this.tracks.some((t) => t.id === id)) {
      console.warn(`[EffectTimeline] Track "${id}" already exists, skipping`)
      return
    }
    this.tracks.push({ id, execute })
  }

  /**
   * Add a sequential track to the timeline.
   * Sequential tracks execute in insertion order with delays between them.
   *
   * @param id - Unique identifier for debugging/logging
   * @param delay - Delay in ms to wait before starting this track
   * @param execute - Function that starts the animation and returns a promise
   */
  addSequentialTrack(id: string, delay: number, execute: () => Promise<void>): void {
    if (this.sequentialTracks.some((t) => t.id === id)) {
      console.warn(`[EffectTimeline] Sequential track "${id}" already exists, skipping`)
      return
    }
    this.sequentialTracks.push({ id, delay, execute })
  }

  /**
   * Remove a track by ID.
   *
   * @param id - Track identifier to remove
   * @returns true if track was found and removed
   */
  removeTrack(id: string): boolean {
    const index = this.tracks.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.tracks.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Play all tracks in parallel.
   * Resolves when ALL tracks have completed.
   *
   * If timeline is already playing, returns immediately.
   */
  async play(): Promise<void> {
    if (this.isPlaying) {
      console.warn('[EffectTimeline] Already playing, ignoring play() call')
      return
    }

    if (this.tracks.length === 0) {
      return
    }

    this.isPlaying = true

    try {
      // Execute all tracks in parallel
      await Promise.all(this.tracks.map((track) => track.execute()))
    } finally {
      this.isPlaying = false
    }
  }

  /**
   * Play sequential tracks in insertion order with delays.
   * Each track waits its delay, executes, then moves to the next.
   *
   * If timeline is already playing, returns immediately.
   */
  async playSequential(): Promise<void> {
    if (this.isPlaying) {
      console.warn('[EffectTimeline] Already playing, ignoring playSequential() call')
      return
    }

    if (this.sequentialTracks.length === 0) {
      return
    }

    this.isPlaying = true

    try {
      for (const track of this.sequentialTracks) {
        if (track.delay > 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, track.delay))
        }
        await track.execute()
      }
    } finally {
      this.isPlaying = false
    }
  }

  /**
   * Clear all tracks without executing them.
   */
  clear(): void {
    this.tracks = []
    this.sequentialTracks = []
  }

  /**
   * Check if the timeline has any tracks.
   */
  get isEmpty(): boolean {
    return this.tracks.length === 0 && this.sequentialTracks.length === 0
  }

  /**
   * Get the number of tracks.
   */
  get size(): number {
    return this.tracks.length + this.sequentialTracks.length
  }

  /**
   * Check if currently playing.
   */
  get playing(): boolean {
    return this.isPlaying
  }
}
