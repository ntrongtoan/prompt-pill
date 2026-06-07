import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: './tsconfig.app.json', outDirs: ['dist'], entryRoot: 'src' }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PromptPill',
      formats: ['es', 'cjs'],
      fileName: (format) => `prompt-pill.${format}.js`,
    },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('@tiptap/'),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tiptap/react': 'TiptapReact',
          '@tiptap/core': 'TiptapCore',
          '@tiptap/starter-kit': 'TiptapStarterKit',
          '@tiptap/pm': 'TiptapPm',
        },
      },
    },
  },
})
