import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 *
 * Combines the conditional class handling of clsx with tailwind-merge's
 * intelligent Tailwind CSS class deduplication and conflict resolution.
 *
 * @example
 * cn("p-4", "p-2") // => "p-2" (tailwind-merge resolves conflict)
 * cn("text-red-500", isActive && "text-blue-500") // conditional classes
 * cn(["flex", "items-center"], { "gap-4": hasGap }) // arrays and objects
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
