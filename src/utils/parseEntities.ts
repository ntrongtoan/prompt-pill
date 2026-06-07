export const ENTITY_REGEX = /\{\{[\w.[\]]+\}\}/g

export interface EntityMatch {
  raw: string
  path: string
}

/**
 * Parse all {{...}} entity tokens from a string.
 * Returns an array of {raw, path} objects.
 *
 * Supports:
 *   {{aa}}           → path: "aa"
 *   {{json.a}}       → path: "json.a"
 *   {{arr[0].a.b}}   → path: "arr[0].a.b"
 */
export function parseEntities(text: string): EntityMatch[] {
  const results: EntityMatch[] = []
  const regex = new RegExp(ENTITY_REGEX.source, 'g')
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0]
    const path = raw.slice(2, -2) // strip {{ and }}
    results.push({ raw, path })
  }

  return results
}
