import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/auth': {
        target: "http://localhost:4000",
        secure: false,
      },
      '/api/user': {
        target: "http://localhost:4001",
        secure: false,
      },
      '/api/post': {
        target: "http://localhost:4003",
        secure: false,
      },
      '/api/comment': {
        target: "http://localhost:4003",
        secure: false,
      },
    },
  },
  plugins: [react()],
});