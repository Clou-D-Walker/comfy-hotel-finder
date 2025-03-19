
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into one string for use with Tailwind CSS
 * @param {import("clsx").ClassValue[]} inputs - The class names to combine
 * @returns {string} The combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
