import { defineConfig } from 'vitepress'
import renderPermaLink from './render-perma-link'
import MarkDownItCustomAnchor from './markdown-it-custom-anchor'

const ogDescription = 'Next Generation Admin Construct'
// const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'vue3-admin-plus'
const ogUrl = 'https://vitejs.dev'
export default defineConfig({
  title: 'vue3-admin-plus',
  description: '下一代前端工具链',
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
    localeLinks: {
      text: 'English',
      items: [
        { text: '简体中文', link: 'https://github.jzfai.top/vue3-admin-cn-doc' },
        // { text: '日本語', link: 'https://ja.vitejs.dev' },
        // { text: 'Español', link: 'https://es.vitejs.dev' }
      ]
    },
    footer: {
      copyright:
        '本中文文档内容版权为 vue3-admin-plus 官方中文翻译团队所有，保留所有权利。'
    },
    nav:[
      { text: '指引', link: '/guide/', activeMatch: '/guide/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指引',
          items: [
            {
              text: '前言',
              link: '/guide/why'
            },
            {
              text: '开始',
              link: '/guide/'
            },
            {
              text: 'prettier,eslint和husk',
              link: '/guide/eslint-prettier'
            },
            {
              text: 'vscode和idea推荐配置',
              link: '/guide/vscode-idea-setting'
            },
          ]
        },
        {
          text: '基础',
          items: [
            {
              text: '目录结构介绍',
              link: '/guide/dir-instruct'
            },
            {
              text: '多环境设置',
              link: '/guide/env-setting'
            },
            {
              text: '配置(settings.js)',
              link: '/guide/setting'
            },
            {
              text: 'axios使用及取消请求',
              link: '/guide/axios-req'
            },
            {
              text: 'vite.config.js配置',
              link: '/guide/vite-config'
            },

            {
              text: 'mock篇',
              link: '/guide/mock'
            },
            {
              text: '全局错误日志收集(待更新) ',
              link: '/guide/error-collection'
            }
          ]
        },
        {
          text: '进阶',
          items: [
            {
              text: '登录和路由权限篇(待更新)',
              link: '/guide/permission'
            },
            {
              text: 'keep-alive缓存篇(待更新)',
              link: '/guide/keep-alive'
            },
            {
              text: 'i18n国际化语言(待更新)',
              link: '/guide/i18n'
            }
          ]
        },
        {
          text: '其他',
          items: [
            {
              text: 'reactive和ref',
              link: '/guide/ref-reactive'
            },
            {
              text: '如何解决跨域',
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
