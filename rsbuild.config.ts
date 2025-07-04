import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack';
import { presetWind3 } from '@unocss/preset-wind3';

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
  ],
  tools: {
    rspack: {
      plugins: [
        UnoCSSRspackPlugin({
          presets: [presetWind3(),],
        }),
      ],
    },
  },
});
