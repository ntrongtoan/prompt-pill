import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { generateText, type JSONContent, type Extensions } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EntityNode } from '../extensions/EntityNode'

const BASE_EXTENSIONS: Extensions = [Document, Paragraph, Text]

export interface EntityInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  mapping?: Record<string, string>
  onEntityClick?: (id: string, pos: number) => void
  extensions?: Extensions
}

export interface EntityInputHandle {
  insertEntity: (id: string) => void
}

const ENTITY_SPLIT_REGEX = /(\{\{[\w.[\]]+\}\})/g

function textToContent(text: string): JSONContent {
  const parts = text.split(ENTITY_SPLIT_REGEX).filter(Boolean)

  const inlineContent: JSONContent[] = parts.map((part) => {
    const match = part.match(/^\{\{([\w.[\]]+)\}\}$/)
    if (match) {
      return { type: 'entity', attrs: { id: match[1] } }
    }
    return { type: 'text', text: part }
  })

  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: inlineContent }],
  }
}

export const EntityInput = forwardRef<EntityInputHandle, EntityInputProps>(function EntityInput(
  { value, onChange, placeholder, mapping, onEntityClick, extensions = [] }: EntityInputProps,
  ref,
) {
  const mappingRef = useRef(mapping)
  useEffect(() => {
    mappingRef.current = mapping
  }, [mapping])

  const onEntityClickRef = useRef(onEntityClick)
  useEffect(() => {
    onEntityClickRef.current = onEntityClick
  }, [onEntityClick])

  const editor = useEditor({
    extensions: [
      EntityNode.configure({
        mappingRef,
        onEntityClick: (id, pos) => onEntityClickRef.current?.(id, pos),
      }),
      ...BASE_EXTENSIONS,
      ...(extensions ?? []),
    ],
    content: textToContent(value ?? ''),
    editorProps: {
      attributes: {
        class: 'entity-editor',
        'data-placeholder': placeholder ?? 'Type here… use {{variable}} syntax',
      },
    },
    onUpdate({ editor }) {
      const extensions = editor.extensionManager.extensions as Extensions
      const text = generateText(editor.getJSON(), extensions, {
        textSerializers: {
          entity: ({ node }) => `{{${node.attrs.id}}}`,
        },
      })
      onChange?.(text)
    },
  })

  useEffect(() => {
    if (!editor) return
    const extensions = editor.extensionManager.extensions as Extensions
    const current = generateText(editor.getJSON(), extensions, {
      textSerializers: {
        entity: ({ node }) => `{{${node.attrs.id}}}`,
      },
    })
    if (value !== undefined && value !== current) {
      editor.commands.setContent(textToContent(value))
    }
  }, [value, editor])

  useImperativeHandle(
    ref,
    () => ({
      insertEntity(id: string) {
        if (!editor) return
        editor.chain().focus().insertContent({ type: 'entity', attrs: { id } }).run()
      },
    }),
    [editor],
  )

  return (
    <div className="entity-input-wrapper">
      <EditorContent editor={editor} />
    </div>
  )
})
