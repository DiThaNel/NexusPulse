import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names with Tailwind CSS conflict resolution.
 * Standard utility function for Shadcn UI and component-driven architecture.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
