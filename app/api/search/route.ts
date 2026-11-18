import { buildSearchIndex } from '../../../lib/search';
import { loadUpdates } from '../../../lib/changelog-feed';

export const revalidate = 300;

export async function GET() {
  return Response.json(buildSearchIndex(await loadUpdates()));
}
