module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Goa',
      description: 'Middleware-based Web Framework For Golang'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Goa',
      description: '基于中间件的轻量级golang web框架'
    }
  },
  themeConfig: {
    repo: 'goa-go/goa',
    docsRepo: 'goa-go/docs',
    docsDir: 'docs',
    editLinks: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        sidebar: {
          '/docs/': [
            '',
            'getting-started',
            'goa',
            'context',
            'middleware'
          ]
        },
        nav: [
          {
            text: 'Changelog',
            link: 'https://github.com/goa-go/goa/blob/master/CHANGELOG.md'
          },
        ],
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        sidebar: {
          '/zh/docs/': [
            '',
            'getting-started',
            'goa',
            'context',
            'middleware'
          ]
        },
        nav: [
          {
            text: 'Changelog',
            link: 'https://github.com/goa-go/goa/blob/master/CHANGELOG.md'
          }
        ]
      }
    }
  },
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/google-analytics',{
      'ga': 'UA-147616433-1'
    }],
    ['@vuepress/medium-zoom', true],
  ],
  port: 8000
}
