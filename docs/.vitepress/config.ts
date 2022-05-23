import { defineConfig } from 'vitepress'

//en
// import nav from './configs/nav'
import sidebar from './configs/sidebar'

//zh
// import navZh from './configs/zh/nav'
import sidebarZh from './configs/zh/sidebar'

export default defineConfig({
  base: '/vue3-admin-doc',
  title: 'vue3-admin-plus',
  description: '新一代的前端pc框架',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  locales: {
    '/': {
      lang: 'en-US'
    },
    '/zh/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    lastUpdated: '最近更新',
    repoLabel: 'Github',
    prevLinks: true,
    nextLinks: true,
    repo: 'https://github.com/jzfai/vue3-admin-plus',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'master',
    //搜索
    algolia: {
      appId: '8J64VVRP8K',
      apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
      indexName: 'vitepress'
    },
    // page meta
    editLinkText: '在 GitHub 上编辑此页',
    locales: {
      '/zh/': {
        label: '中文',
        selectText: '中文',
        nextLinks: true,
        nav: [
          { text: `文档`, link: `/zh/guide/start` },
          // { text: `组件`, link: `${prefix}components/button` },
          // { text: `API 参考`, link: `${prefix}api/` },
          {
            text: `更新日志`,
            link: `https://github.com/jzfai/vue3-admin-plus/releases/tag/v1.5.5`
          },
          {
            text: '链接',
            items: [
              {
                text: 'vue3-admin-template',
                link: 'https://github.com/jzfai/vue3-admin-template'
              },
              {
                text: 'vue3-admin-ts',
                link: 'https://github.com/jzfai/vue3-admin-ts'
              },
              {
                text: 'vue3-admin-doc',
                link: 'https://github.com/jzfai/vue3-admin-doc'
              },
              {
                text: 'micro-service-plus',
                link: 'https://github.com/jzfai/micro-service-plus'
              }
            ]
          }
        ],
        sidebar: sidebarZh
      },
      '/': {
        label: 'English',
        selectText: 'English',
        nextLinks: true,
        nav: [
          { text: 'Guide', link: '/guide/start' },
          {
            text: 'Update Log',
            link: 'https://github.com/jzfai/vue3-admin-plus/releases/tag/v1.5.5'
          },
          {
            text: 'Links',
            items: [
              {
                text: 'vue3-admin-template',
                link: 'https://github.com/jzfai/vue3-admin-template'
              },
              {
                text: 'vue3-admin-ts',
                link: 'https://github.com/jzfai/vue3-admin-ts'
              },
              {
                text: 'vue3-admin-doc',
                link: 'https://github.com/jzfai/vue3-admin-doc'
              },
              {
                text: 'micro-service-plus',
                link: 'https://github.com/jzfai/micro-service-plus'
              }
            ]
          }
        ],
        sidebar: sidebar
      }
    }
  },
  markdown: {
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2] },
    config: (md) => {
      // @ts-ignore
      const { demoBlockPlugin } = require('vitepress-theme-demoblock')
      md.use(demoBlockPlugin, {
        cssPreprocessor: 'less'
      })
    }
  }
})
