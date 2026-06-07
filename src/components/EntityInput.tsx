import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EntityMark } from '../extensions/EntityMark'

export interface EntityInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function EntityInput({ value, onChange, placeholder }: EntityInputProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable block nodes we don't need; keep only paragraph + text
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      EntityMark,
    ],
    content: value ?? '',
    editorProps: {
      attributes: {
        class: 'entity-editor',
        'data-placeholder': placeholder ?? 'Type here… use {{variable}} syntax',
      },
    },
    onUpdate({ editor }) {
      // Return plain text — {{...}} tokens remain intact as text
      const text = editor.getText()
      onChange?.(text)
    },
  })

  // Sync controlled value changes from outside
  useEffect(() => {
    if (!editor) return
    const current = editor.getText()
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="entity-input-wrapper">
      <EditorContent editor={editor} />
    </div>
  )
}
