# PromptPill

A React rich-text input that renders `{{variable}}` tokens as interactive pill chips — built for AI prompt editors, agent builders, and workflow UIs.

[![npm](https://img.shields.io/npm/v/prompt-pill)](https://www.npmjs.com/package/prompt-pill)
[![license](https://img.shields.io/npm/l/prompt-pill)](./LICENSE)

## Why PromptPill?

When building AI-powered apps, users write prompts and templates with dynamic slots like `{{user.name}}` or `{{context[0].text}}`. Raw text inputs make these hard to read and easy to break. PromptPill turns those tokens into visual chips in real time — while keeping the underlying value as plain `{{...}}` text that your LLM or template engine consumes directly.

**Perfect for:**
- Prompt template editors
- LangChain / LlamaIndex input nodes
- n8n / Zapier-style workflow step editors
- Agent system-prompt builders
- Any UI where users mix free text with variable slots

## Features

- Highlights `{{name}}`, `{{obj.key}}`, `{{arr[0].key}}` tokens as pill chips in real time
- `onChange(value: string)` always returns the original plain text with `{{...}}` intact — no special encoding
- Optional `mapping` prop to show human-readable labels inside pills (e.g. `{{user.name}}` → `Full Name`)
- `onEntityClick` callback for building variable pickers or hover tooltips
- Fully controlled component (`value` / `onChange`)
- Built on [Tiptap](https://tiptap.dev/) v3 + ProseMirror — battle-tested rich text foundation
- Zero runtime CSS-in-JS — ships a plain CSS file you can customize

## Install

```bash
npm install prompt-pill
```

**Peer dependencies** (install if you don't have them already):

```bash
npm install react react-dom @tiptap/react @tiptap/starter-kit @tiptap/core @tiptap/pm
```

## Quick start

```tsx
import { EntityInput } from 'prompt-pill'
import 'prompt-pill/dist/prompt-pill.css'

function PromptEditor() {
  const [prompt, setPrompt] = useState('Hello {{user.name}}, summarize {{document.text}}')

  return (
    <EntityInput
      value={prompt}
      onChange={setPrompt}
      placeholder="Write your prompt… use {{variable}} for dynamic slots"
      mapping={{
        'user.name': 'User Name',
        'document.text': 'Document',
      }}
    />
  )
}
```

## API

### `<EntityInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled plain-text value |
| `onChange` | `(value: string) => void` | — | Called on every change; receives plain text with `{{...}}` intact |
| `placeholder` | `string` | `"Type here… use {{variable}} syntax"` | Placeholder shown when empty |
| `mapping` | `Record<string, string>` | — | Map of variable path → display label shown inside the pill |
| `onEntityClick` | `(id: string, pos: number) => void` | — | Fired when a pill is clicked; receives the variable path and document position |

### `parseEntities(text: string): EntityMatch[]`

Utility to extract all `{{...}}` tokens from a string:

```ts
import { parseEntities } from 'prompt-pill'

parseEntities('Hello {{user.name}}, your score is {{score}}')
// [
//   { raw: '{{user.name}}', path: 'user.name' },
//   { raw: '{{score}}',     path: 'score'     },
// ]
```

## Supported token syntax

| Form | Example |
|------|---------|
| Simple identifier | `{{name}}` |
| Dot-notation path | `{{user.score}}` |
| Array access | `{{arr[0].label}}` |
| Nested | `{{response.items[2].text}}` |

## Customizing styles

Import the base CSS then override the classes you need:

```css
/* Make pills match your brand */
.entity-token {
  background: #7c3aed;
  border-radius: 999px;
  padding: 1px 8px;
}

/* Editor border */
.entity-input-wrapper {
  border-color: #e2e8f0;
  border-radius: 12px;
}
```

## Tech stack

| Tool | Purpose |
|------|---------|
| Vite + React + TypeScript | Build tooling |
| `@tiptap/react` + `@tiptap/starter-kit` | Rich text editor |
| ProseMirror Decorations | Non-destructive inline highlighting |

## Contributing

Issues and PRs are welcome at [github.com/ntrongtoan/prompt-pill](https://github.com/ntrongtoan/prompt-pill).

## License

MIT © [ntrongtoan](mailto:toantrongvn@gmail.com)
