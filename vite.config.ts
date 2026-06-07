import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PromptPill',
      formats: ['es', 'cjs'],
      fileName: (format) => `prompt-pill.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@tiptap/react', '@tiptap/starter-kit', '@tiptap/core', '@tiptap/pm'],
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
