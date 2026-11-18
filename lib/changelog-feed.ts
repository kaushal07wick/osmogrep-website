import { validateNotes } from '../scripts/changelog-policy.mjs';
import { majorUpdates, type ProductUpdate } from './changelog.ts';

export const cloudChangelogUrl = 'https://app.osmogrep.com/changelog.json';
const publicationTime = (value: string) => Date.parse(value.replace(/(\d{1,2})[–-]\d{1,2}(?=,)/, '$1')) || 0;
export function mergeUpdates(local: ProductUpdate[], cloud: ProductUpdate[]) {
  const updates = new Map(local.map(update => [update.id, update]));
  for (const update of cloud) {
    if (updates.has(update.id) && updates.get(update.id)?.product !== 'Cloud') throw new Error('Cloud update conflicts with another product.');
    updates.set(update.id, update);
  }
  return [...updates.values()].sort((a, b) => publicationTime(b.date) - publicationTime(a.date));
}

export async function loadUpdates(fetcher: typeof fetch = fetch): Promise<ProductUpdate[]> {
  try {
    const response = await fetcher(cloudChangelogUrl, { signal: AbortSignal.timeout(4000), next: { revalidate: 300 } });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json') || !response.body) throw new Error('Cloud notes unavailable.');
    const reader = response.body.getReader(), chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > 256_000) { await reader.cancel(); throw new Error('Cloud notes exceed the publication limit.'); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const cloud = validateNotes(JSON.parse(Buffer.concat(chunks).toString('utf8')), 'Cloud') as ProductUpdate[];
    return mergeUpdates(majorUpdates, cloud);
  } catch {
    console.warn('Public cloud changelog unavailable; serving bundled history.');
    return mergeUpdates(majorUpdates, []);
  }
}

export function updateDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) : value;
}
