/**
 * TransitionStack - manages exit/entry task stacks for page transitions.
 *
 * Tasks are executed FIFO (first registered, first executed).
 * Tasks can be duration-based (setTimeout) or promise-based (async).
 */

import type { TransitionTask } from '../experiences/types'

/**
 * Execute a single transition task.
 * Returns a promise that resolves when the task completes.
 */
function executeTask(task: TransitionTask): Promise<void> {
  if (task.type === 'duration') {
    return new Promise((resolve) => setTimeout(resolve, task.duration))
  }
  return task.promise
}

/**
 * Execute all tasks in a stack with a timeout.
 * Tasks run in parallel but the overall execution has a max duration.
 *
 * @param tasks - Array of tasks to execute
 * @param timeout - Maximum time to wait (ms)
 * @returns Promise that resolves when all tasks complete or timeout expires
 */
export async function executeStack(
  tasks: TransitionTask[],
  timeout: number = 2000
): Promise<void> {
  if (tasks.length === 0) return

  const taskPromises = tasks.map(executeTask)

  await Promise.race([
    Promise.all(taskPromises),
    new Promise<void>((resolve) => setTimeout(resolve, timeout)),
  ])
}

/**
 * Create a transition task from various inputs.
 * Normalizes different task formats into TransitionTask.
 */
export function createTask(
  input: number | Promise<void> | (() => Promise<void>)
): TransitionTask {
  if (typeof input === 'number') {
    return { type: 'duration', duration: input }
  }
  if (typeof input === 'function') {
    return { type: 'promise', promise: input() }
  }
  return { type: 'promise', promise: input }
}

/**
 * TransitionStack class for managing task registration.
 */
export class TransitionStack {
  private tasks: TransitionTask[] = []

  /**
   * Add a task to the stack.
   * Returns a function to remove the task.
   */
  add(task: TransitionTask): () => void {
    this.tasks.push(task)
    return () => {
      const index = this.tasks.indexOf(task)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    }
  }

  /**
   * Execute all tasks and clear the stack.
   */
  async execute(timeout?: number): Promise<void> {
    const tasksToExecute = [...this.tasks]
    this.tasks = []
    await executeStack(tasksToExecute, timeout)
  }

  /**
   * Clear all tasks without executing.
   */
  clear(): void {
    this.tasks = []
  }

  /**
   * Get current task count.
   */
  get size(): number {
    return this.tasks.length
  }
}
