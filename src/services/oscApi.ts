import { OSCApp } from '../types/osc';

const API_BASE = 'https://hbb1.oscwii.org/api/v3';

let cachedApps: OSCApp[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function fetchApps(): Promise<OSCApp[]> {
  const now = Date.now();
  if (cachedApps && now - cacheTimestamp < CACHE_DURATION) {
    return cachedApps;
  }

  const response = await fetch(`${API_BASE}/contents`, {
    headers: { 'User-Agent': 'WiiHomebrewSender/1.0' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const apps: OSCApp[] = await response.json();
  cachedApps = apps;
  cacheTimestamp = now;
  return apps;
}

export function getIconUrl(slug: string): string {
  return `${API_BASE}/contents/${slug}/icon.png`;
}

export function getZipUrl(slug: string): string {
  return `${API_BASE}/contents/${slug}/${slug}.zip`;
}

export function clearCache(): void {
  cachedApps = null;
  cacheTimestamp = 0;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
