// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1',
      title: 'InActually',
      meta: [
        { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      ],
      link: [{
        hid: 'icon',
        rel: 'icon',
        type: 'image/x-icon',
        href: 'inACTually_icon.ico'
      }]
    }
  },
  css: ['@/assets/style/main.scss', 'primevue/resources/themes/aura-light-green/theme.css', 'primeicons/primeicons.css'],
  imports: {
    dirs: [
      'composables/**',
    ]
  },
  modules: [
    'nuxt-primevue'
  ],
  components: [
    {
      path: '~/components',
      // pathPrefix: false,
    },
  ],
  devServer: {
    // https: {
    //   key: 'localhost-key.pem',
    //   cert: 'localhost.pem'
    // }
  },
})
