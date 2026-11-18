export function validateNotes(notes: unknown, product?: string): unknown[];
export function requireMajorNote(notes: { id: string }[], previous: { id: string }[], options?: { marked?: boolean; messages?: string }): boolean;
