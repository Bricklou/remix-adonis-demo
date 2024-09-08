import adonisjs from '@adonisjs/vite/client'
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/assets/',
  plugins: [
    remix({
      appDirectory: 'resources/remix_app',
      buildDirectory: 'build/remix',
      serverBuildFile: 'server.js',
    }),
    adonisjs({
      entrypoints: [],
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    esbuildOptions: isSsrBuild ? { target: 'ES2022' } : {},
  },
}))
