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
      { text: '指引', link: '/guide/', activeMatch: '/guide/' },
      { text: '框架搭建', link: '/rebuild/', activeMatch: '/rebuild/' },
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
      ],
      '/rebuild/': [
        {
          text: '基础环境搭建',
          items: [
            {
              text: '前言及工具准备',
              link: '/rebuild/index'
            },
            {
              text: '如何搭建一个框架',
              link: '/rebuild/how-to-build'
            },
            {
              text: 'vue3+vite3工程及多环境配置',
              link: '/rebuild/init-env'
            }
          ]
        },
        {
          text: '代码规范集成',
          items: [
            {
              text: 'eslint husky pretties集成',
              link: '/rebuild/code-format'
            }
          ]
        },
        {
          text: '请求和样式',
          items: [
            {
              text: 'element-plus集成及全局配置',
              link: '/rebuild/element-plus-inter'
            },
            {
              text: 'axios请求集成及取消请求',
              link: '/rebuild/axios-inter'
            },
            {
              text: 'mock开发和生产环境集成',
              link: '/rebuild/mock-inter'
            },

          ]
        },
        {
          text: '国际化语言',
          items: [
            {
              text: 'i18n和element-plus国际化语言',
              link: '/rebuild/i18n-inter'
            },
          ]
        },
        {
          text: 'vite常用插件集成',
          items: [
            {
              text: 'vite常用插件',
              link: '/rebuild/vite-plugin'
            }
          ]
        },
        {
          text: 'vue3全家桶',
          items: [
            {
              text: 'vue-router集成及路由权限',
              link: '/rebuild/vue-router'
            },
            {
              text: 'vue3基础及vue2快速转换vue3',
              link: '/rebuild/vue3-basic'
            },

            {
              text: 'pinia及持久化集成使用',
              link: '/rebuild/pinia'
            },
          ]
        },
        {
          text: 'typescript基础及集成',
          items: [
            {
              text: 'typescript基础',
              link: '/rebuild/typescript-basic'
            },
            {
              text: 'typescript集成到框架',
              link: '/rebuild/typescript-inter'
            }
          ]
        },
        {
          text: '权限和布局',
          items: [
            {
              text: '登录和路由权限篇(基础)',
              link: '/rebuild/permission-basic'
            },
            {
              text: '登录和路由权限篇(进阶)',
              link: '/rebuild/permission-inter'
            },
            {
              text: 'layout核心布局讲解',
              link: '/rebuild/layout'
            },
          ]
        },
        {
          text: '自定义vite插件',
          items: [
            {
              text: 'vite插件基础',
              link: '/rebuild/vite-basic'
            },
            {
              text: 'vite插件例子',
              link: '/rebuild/vite-demo'
            }
          ]
        },
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
