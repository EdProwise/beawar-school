import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves an image URL to always be a proper absolute or root-relative path.
 * Strips hardcoded localhost/host prefixes so URLs work in production.
 * Handles: "/uploads/...", "http://localhost:5000/uploads/...", relative "uploads/..."
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  // Already a relative root path
  if (url.startsWith('/uploads/')) return url;
  // Already an external URL (not localhost)
  if (url.startsWith('http') && !url.includes('localhost') && !url.match(/^https?:\/\/[\w.-]+:\d+/)) return url;
  // Strip any absolute origin prefix (e.g. http://localhost:5000 or https://example.com:5000)
  const uploadsIndex = url.indexOf('/uploads/');
  if (uploadsIndex !== -1) return url.slice(uploadsIndex);
  // Bare relative path without leading slash
  if (url.startsWith('uploads/')) return '/' + url;
  return url;
}
