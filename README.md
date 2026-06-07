# Entity Syntax Highlighter

A React + TypeScript proof-of-concept that highlights `{{...}}` entity tokens
visually (blue pill style) inside a rich text editor as the user types —
while keeping the underlying value as plain text.

## Features

- Highlights `{{aa}}`, `{{json.a}}`, `{{arr[0].a.b}}` tokens in real time
- Built on [Tiptap](https://tiptap.dev/) with a custom ProseMirror Decoration plugin
- `onChange(value: string)` always returns plain text with `{{...}}` intact
- Fully controlled via `value` prop

## Tech stack

| Tool | Purpose |
|------|---------|
| Vite + React + TypeScript | Scaffold |
| `@tiptap/react` + `@tiptap/starter-kit` | Rich text editor |
| ProseMirror Decorations | Non-destructive inline highlighting |

## Project structure

```
src/
  utils/parseEntities.ts      # Regex parser: {{...}} → {raw, path}[]
  extensions/EntityMark.ts    # Tiptap extension (Decoration-based highlighter)
  components/EntityInput.tsx  # Controlled React component
  App.tsx                     # Demo page
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## `EntityInput` component API

```tsx
import { EntityInput } from './components/EntityInput'

<EntityInput
  value={text}
  onChange={(val) => setText(val)}
  placeholder="Type here… use {{variable}} syntax"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Controlled value (plain text) |
| `onChange` | `(value: string) => void` | Called on every keystroke with the plain-text content |
| `placeholder` | `string` | Placeholder text |

## Supported entity syntax

| Form | Example |
|------|---------|
| Simple identifier | `{{name}}` |
| Dot-notation path | `{{user.score}}` |
| Array access | `{{arr[0].label}}` |

## How it works

The extension (`EntityMark.ts`) registers a ProseMirror plugin that walks the
document on every change and builds a `DecorationSet` of `Decoration.inline`
spans with `class="entity-token"` wrapping each `{{...}}` match.
The document stores only plain text — decorations are purely visual overlays.
`editor.getText()` therefore returns the raw plain-text value with
`{{...}}` tokens intact.
