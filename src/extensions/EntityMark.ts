import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const ENTITY_REGEX = /\{\{[\w.[\]]+\}\}/g

const entityPluginKey = new PluginKey('entityHighlight')

/**
 * Tiptap extension that uses ProseMirror Decorations to highlight
 * all {{...}} tokens in the document with the CSS class "entity-token".
 *
 * The underlying text is stored as plain text; decorations are purely visual.
 */
export const EntityMark = Extension.create({
  name: 'entityHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: entityPluginKey,

        state: {
          init(_, { doc }) {
            return buildDecorations(doc)
          },
          apply(tr, oldDecoSet) {
            if (tr.docChanged) {
              return buildDecorations(tr.doc)
            }
            return oldDecoSet.map(tr.mapping, tr.doc)
          },
        },

        props: {
          decorations(state) {
            return entityPluginKey.getState(state)
          },
        },
      }),
    ]
  },
})

function buildDecorations(doc: Parameters<typeof DecorationSet.create>[0]): DecorationSet {
  const decorations: Decoration[] = []

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return

    const regex = new RegExp(ENTITY_REGEX.source, 'g')
    let match: RegExpExecArray | null

    while ((match = regex.exec(node.text)) !== null) {
      const start = pos + match.index
      const end = start + match[0].length

      decorations.push(
        Decoration.inline(start, end, {
          class: 'entity-token',
          nodeName: 'span',
        })
      )
    }
  })

  return DecorationSet.create(doc, decorations)
}
