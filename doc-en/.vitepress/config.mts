import { defineConfig } from 'vitepress'
import renderPermaLink from './render-perma-link'
import MarkDownItCustomAnchor from './markdown-it-custom-anchor'

const ogDescription = 'Next Generation Admin Construct'
// const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'vue3-admin-plus'
const ogUrl = 'https://vitejs.dev'
export default defineConfig({
  title: 'vue3-admin-plus',
  description: 'The next generation solution for front',
  base: '/vue3-admin-doc',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
  ],
  vue: {
    reactivityTransform: true
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      text: '为此页提供修改建议',
      pattern: 'https://github.com/jzfai/vue3-admin-plus/issues'
    },
    socialLinks: [
      // { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://github.jzfai.top/file/images/wx-groud.png' },
      { icon: 'github', link: 'https://github.com/jzfai/vue3-admin-doc.git' }
    ],
    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:cn']
      }
    },
    footer: {
      copyright:
        '© Vue3-Admin-Plus-Team Rights Reserved'
    },
    nav:[
      { text: 'GUIDE', link: '/guide/', activeMatch: '/guide/' },
      {
        text: 'Language',
        items: [
          { text: '简体中文', link: 'https://github.jzfai.top/vue3-admin-cn-doc' },
          { text: 'English', link: 'https://github.jzfai.top/vue3-admin-en-doc' },
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'GUIDE',
          items: [
            {
              text: 'Why Vue3-admin-plus',
              link: '/guide/why'
            },
            {
              text: 'Try It Out',
              link: '/guide/'
            },
            {
              text: 'Prettier,Eslint,Husk',
              link: '/guide/eslint-prettier'
            },
            {
              text: 'VSCode Config',
              link: '/guide/vscode-setting'
            },
            {
              text: 'IDEA/WebStorm Config',
              link: '/guide/idea-webstrom-setting'
            },
          ]
        },
        {
          text: 'BASE',
          items: [
            {
              text: 'Dirs Introduction',
              link: '/guide/dir-instruct'
            },
            {
              text: 'Env Config',
              link: '/guide/env-setting'
            },
            {
              text: 'About Setting.js',
              link: '/guide/setting'
            },
            {
              text: 'Use Axios',
              link: '/guide/axios-req'
            },
            {
              text: 'Vite.config.js',
              link: '/guide/vite-config'
            },

            {
              text: 'Use Mock',
              link: '/guide/mock'
            },
            {
              text: 'Error Collection ',
              link: '/guide/error-collection'
            }
          ]
        },
        {
          text: 'ADVANCE',
          items: [
            {
              text: 'Login And Permission',
              link: '/guide/permission'
            },
            {
              text: 'Keep-alive Cache(Basic)',
              link: '/guide/keep-alive-basic'
            },
            {
              text: 'Keep-alive Cache',
              link: '/guide/keep-alive'
            },
            {
              text: 'I18n',
              link: '/guide/i18n'
            },
            {
              text: 'Theme Color',
              link: '/guide/theme-setting'
            },
          ]
        },
        {
          text: 'OTHERS',
          items: [
            {
              text: 'Vue2 To Vue3',
              link: '/guide/vue2-vue3-fast'
            },
            {
              text: 'Reactive/Ref',
              link: '/guide/ref-reactive'
            },
            {
              text: 'About CORS',
              link: '/guide/cors'
            }
          ]
        }
      ]
    }
  },
  markdown: {
    anchor: {
      permalink: renderPermaLink
    },
    config: (md) => {
      md.use(MarkDownItCustomAnchor)
    }
  }
})
