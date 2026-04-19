import { defineConfig, PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';
import path from "path";

export default defineConfig(({ mode }) => {
  const plugins = [
    ...enterProdPlugin(),
  ];

  if (mode === 'development') {
    plugins.push(...enterDevPlugin());
  }

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: 'all', // ✅ FIX ADDED HERE
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
        '/sitemap.xml': {
            target: 'http://127.0.0.1:5000',
            changeOrigin: true,
          },
          '/uploads': {
            target: 'http://127.0.0.1:5000',
            changeOrigin: true,
          },
      },
    },

    plugins: plugins.filter(Boolean) as PluginOption[],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    base: '/',
    
    build: {
      outDir: 'dist',
    }
  };
});
