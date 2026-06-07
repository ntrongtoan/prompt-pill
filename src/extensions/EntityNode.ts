import { Node, mergeAttributes, InputRule } from '@tiptap/core'
import type { MutableRefObject } from 'react'

export interface EntityNodeOptions {
  mappingRef?: MutableRefObject<Record<string, string> | undefined>
  onEntityClick?: (id: string, pos: number) => void
}

const ENTITY_INPUT_REGEX = /\{\{([\w.[\]]+)\}\}$/

export const EntityNode = Node.create<EntityNodeOptions>({
  name: 'entity',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-entity]',
        getAttrs: (el) => ({
          id: (el as HTMLElement).getAttribute('data-entity') ?? '',
        }),
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const id: string = node.attrs.id
    return [
      'span',
      mergeAttributes({ 'data-entity': id, class: 'entity-token' }, HTMLAttributes),
      id,
    ]
  },

  addNodeView() {
    return ({ node, getPos }) => {
      const { mappingRef, onEntityClick } = this.options
      const id: string = node.attrs.id

      const dom = document.createElement('span')
      dom.className = 'entity-token'
      dom.setAttribute('data-entity', id)
      dom.setAttribute('contenteditable', 'false')

      const refresh = () => {
        const mapping = mappingRef?.current
        dom.textContent = (mapping && mapping[id]) || id
      }

      refresh()

      dom.addEventListener('click', (e) => {
        e.stopPropagation()
        const pos = typeof getPos === 'function' ? (getPos() ?? -1) : -1
        onEntityClick?.(id, pos)
      })

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'entity') return false
          refresh()
          return true
        },
      }
    }
  },

  addInputRules() {
    return [
      new InputRule({
        find: ENTITY_INPUT_REGEX,
        handler: ({ state, range, match }) => {
          const id = match[1]
          if (!id) return null
          const node = state.schema.nodes.entity.create({ id })
          state.tr.replaceWith(range.from, range.to, node)
        },
      }),
    ]
  },
})
