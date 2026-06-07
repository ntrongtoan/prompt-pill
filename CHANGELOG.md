# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-06-07

### Added
- `EntityInput` React component with controlled `value` / `onChange` API
- Real-time `{{variable}}` token highlighting rendered as interactive pill chips
- Support for simple identifiers (`{{name}}`), dot-notation (`{{user.score}}`), and bracket access (`{{arr[0].label}}`)
- Optional `mapping` prop to display human-readable labels inside pills
- `onEntityClick` callback with entity id and document position
- Built on Tiptap v3 + ProseMirror Decorations — plain text is always preserved underneath
- TypeScript types exported (`EntityInputProps`)
- Storybook stories covering all usage patterns and edge cases
