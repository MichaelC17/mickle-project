import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(0) + "K"
  return num.toString()
}

/**
 * Upgrades a YouTube channel thumbnail URL to high resolution (800px).
 * YouTube thumbnails use `=s{size}` in the URL to control resolution.
 * The default API returns s88 (88px) which looks blurry on modern displays.
 */
export function upgradeYouTubeThumbnail(url: string | null | undefined): string | null {
  if (!url) return null
  return url.replace(/=s\d+-/, "=s800-")
}
