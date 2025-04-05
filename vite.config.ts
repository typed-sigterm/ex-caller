import type Token from 'markdown-it/lib/token.mjs';
import type { BuildMeta } from './meta';
import process from 'node:process';
import { URL } from 'node:url';
import pluginI18n from '@intlify/unplugin-vue-i18n/vite';
import pluginVue from '@vitejs/plugin-vue';
import pluginVueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error untyped
import MarkdownItInline from 'markdown-it-for-inline';
import PostcssPresetEnv from 'postcss-preset-env';
import pluginUnocss from 'unocss/vite';
import IconsResolver from 'unplugin-icons/resolver';
import pluginIcons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import pluginComponents from 'unplugin-vue-components/vite';
import pluginMarkdown from 'unplugin-vue-markdown/vite';
import { defineConfig } from 'vite';

const meta: BuildMeta = {
  buildTime: Date.now(),
  commit: process.env.COMMIT_REF?.slice(0, 7),
};

export default defineConfig({
  plugins: [
    pluginVue({
      include: [/\.vue$/, /\.md$/],
    }),
    pluginVueJsx(),

    pluginComponents({
      resolvers: [
        NaiveUiResolver(),
        IconsResolver(),
      ],
      dirs: ['./src/components'],
      directoryAsNamespace: true,
    }),

    pluginUnocss(),
    pluginIcons(),
    pluginI18n(),

    pluginMarkdown({
      markdownItOptions: {
        linkify: true,
      },
      markdownItSetup(md) {
        md.use( // 链接跳转到新标签页
          MarkdownItInline,
          'url_new_win',
          'link_open',
          (tokens: Token[], idx: number) => {
            tokens[idx]?.attrPush(['target', '_blank']);
          },
        );
      },
    }),

    {
      name: 'build-meta',
      transformIndexHtml(html: string) {
        return html.replace(
          '<script type="application/json" id="ex-caller"></script>',
          `<script type="application/json" id="ex-caller">${JSON.stringify(meta)}</script>`,
        );
      },
    },
  ],

  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },

  envPrefix: ['EXC_', 'COMMIT_REF'],

  css: {
    postcss: {
      plugins: [PostcssPresetEnv()],
    },
  },

  server: {
    port: 6408,
  },

  test: {
    globals: true,
  },
});
