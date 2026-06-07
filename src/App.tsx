import { useState } from 'react'
import { EntityInput } from './components/EntityInput'
import './App.css'

const EXAMPLE = 'Hello {{name}}, your score is {{user.score}} and item {{arr[0].label}}'

const ENTITY_MAPPING: Record<string, string> = {
  name: 'Full Name',
  'user.score': 'Score',
}

export default function App() {
  const [text, setText] = useState(EXAMPLE)
  const [lastClicked, setLastClicked] = useState<string | null>(null)

  return (
    <div className="app">
      <h1>PromptPill</h1>
      <p className="subtitle">
        Tokens matching <code>{'{{variable}}'}</code>,{' '}
        <code>{'{{obj.key}}'}</code>, <code>{'{{arr[0].key}}'}</code> render as
        interactive pills. Click a pill to select it.
      </p>

      <section className="demo-section">
        <label className="field-label">Editor</label>
        <EntityInput
          value={text}
          onChange={setText}
          placeholder="Type here… use {{variable}} syntax"
          mapping={ENTITY_MAPPING}
          onEntityClick={(id) => setLastClicked(id)}
        />
      </section>

      {lastClicked && (
        <section className="demo-section">
          <label className="field-label">Last clicked entity</label>
          <pre className="plain-text-preview">{lastClicked}</pre>
        </section>
      )}

      <section className="demo-section">
        <label className="field-label">Plain text value (onChange output)</label>
        <pre className="plain-text-preview">{text}</pre>
      </section>

      <section className="demo-section">
        <label className="field-label">Parsed entities</label>
        <pre className="plain-text-preview">
          {JSON.stringify(
            [...text.matchAll(/\{\{[\w.[\]]+\}\}/g)].map((m) => m[0]),
            null,
            2
          )}
        </pre>
      </section>
    </div>
  )
}
