/**
 * Experience registry.
 * Provides lookup and registration of experiences.
 */

import type { Experience } from './types'

/** Registry of available experiences by ID */
const experiences = new Map<string, Experience>()

/**
 * Register an experience in the registry.
 * Called at module load time by each experience definition.
 */
export function registerExperience(experience: Experience): void {
  if (experiences.has(experience.id)) {
    console.warn(`Experience "${experience.id}" is already registered. Overwriting.`)
  }
  experiences.set(experience.id, experience)
}

/**
 * Get an experience by ID.
 * @returns Experience if found, undefined otherwise
 */
export function getExperience(id: string): Experience | undefined {
  return experiences.get(id)
}

/**
 * Get all registered experience IDs.
 */
export function getExperienceIds(): string[] {
  return Array.from(experiences.keys())
}

/**
 * Get all registered experiences.
 */
export function getAllExperiences(): Experience[] {
  return Array.from(experiences.values())
}
