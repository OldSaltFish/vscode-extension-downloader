import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';
export default defineConfig({
  output: {
    assetPrefix: '/vscode-extension-downloader/',
  },
  html: {
    title: 'VSCode插件下载',
  },
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
  ]
});
