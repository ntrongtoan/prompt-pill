import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EntityInput } from './EntityInput'

const meta: Meta<typeof EntityInput> = {
  title: 'Components/EntityInput',
  component: EntityInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 560, fontFamily: 'sans-serif' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EntityInput>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ValueDisplay({ value }: { value: string }) {
  return (
    <pre
      style={{
        marginTop: 10,
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: 4,
        fontSize: 12,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
    >
      {value}
    </pre>
  )
}

// ---------------------------------------------------------------------------
// Basic / static stories
// ---------------------------------------------------------------------------

export const Empty: Story = {
  args: {
    placeholder: 'Type here… use {{variable}} syntax',
  },
}

// Entity at start, middle, and end — mirrors "input at start / middle / end"
export const EntitiesAtStartMiddleEnd: Story = {
  name: 'Entities — start / middle / end',
  args: {
    value: '{{test_variable}} some text in the middle {{user.name}} more text {{news[0].title}}',
    mapping: {
      test_variable: 'Test Var',
      'user.name': 'Alice',
      'news[0].title': 'Breaking News',
    },
  },
}

// Only entities, back-to-back — stress-tests render with no plain text separators
export const MultipleVariableTypes: Story = {
  name: 'Multiple variable types (dot / bracket notation)',
  args: {
    value: '{{test_variable}} {{user.name}} {{news[0].title}}',
    mapping: {
      test_variable: 'simple',
      'user.name': 'dot.notation',
      'news[0].title': 'bracket[0]',
    },
  },
}

// ---------------------------------------------------------------------------
// Typing / interactive stories
// ---------------------------------------------------------------------------

function TypingStory({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <EntityInput
        value={value}
        onChange={setValue}
        mapping={{
          test_variable: 'Test Var',
          'user.name': 'Alice',
          ss: 'SS Entity',
          'news[0].title': 'Breaking News',
        }}
        placeholder="Type here… use {{variable}} syntax"
      />
      <ValueDisplay value={value} />
    </>
  )
}

// Simulates the user typing "testing{{ss}} ..." mid-session
export const TypingMixedText: Story = {
  name: 'Typing — mixed text and entity (testing{{ss}} …)',
  render: () => <TypingStory initial="testing{{ss}} and some more text after..." />,
}

// Starts empty — open this story and type {{test_variable}}, {{user.name}}, etc.
export const TypingFromEmpty: Story = {
  name: 'Typing — from empty (interactive)',
  render: () => <TypingStory initial="" />,
}

// Entity at the very start followed by plain text
export const EntityAtStart: Story = {
  name: 'Typing — entity at start',
  render: () => <TypingStory initial="{{test_variable}} followed by regular text" />,
}

// Entity at the very end, text before it
export const EntityAtEnd: Story = {
  name: 'Typing — entity at end',
  render: () => <TypingStory initial="Some text before {{news[0].title}}" />,
}

// Entity in the middle between two text spans
export const EntityInMiddle: Story = {
  name: 'Typing — entity in middle',
  render: () => <TypingStory initial="Hello {{user.name}}, welcome back!" />,
}

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

export const UnmappedEntities: Story = {
  name: 'Edge — unmapped entities (no label)',
  args: {
    value: '{{unknown.var}} and {{also.missing}}',
    mapping: {},
  },
}

export const WithClickHandler: Story = {
  name: 'Edge — entity click callback',
  args: {
    value: 'Click {{entity.id}} to trigger the handler.',
    mapping: { 'entity.id': 'Widget' },
    onEntityClick: (id, pos) => alert(`Clicked "${id}" at pos ${pos}`),
  },
}
