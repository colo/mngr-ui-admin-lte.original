// Configuration for your app

const ProvidePlugin = require('webpack/lib/ProvidePlugin')//for jQuery
const CopyWebpackPlugin = require('copy-webpack-plugin')//amchart3 assets

let path = require('path')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'admin-lte',
      'i18n',
      'vue-pouch',
      'vue-observe-visibility',
      // 'amcharts3',
      // 'vueEcharts3',
      'highchartsVue'
      // 'axios'
    ],
    // css: [
    //   'app.styl'
    // ],
    // extras: [
    //   ctx.theme.mat ? 'roboto-font' : null,
    //   // 'material-icons', // optional, you are not bound to it
    //   'ionicons',
    //   // 'mdi',
    //   'fontawesome'
    // ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg, { isServer, isClient }) {
        // console.log(cfg.resolve.alias),
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias


          // Add your own alias like this
          '@libs': path.resolve(__dirname, './src/libs'),
          '@etc': path.resolve(__dirname, './src/etc')
        },
        /**
      	 * for npm 'request' (https://github.com/request/request/issues/1529)
      	 * */
        cfg.node = {
          console: true,
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
          //'node-express-authorization': 'empty'
        },
        // cfg.plugins.push(
        //   new CopyWebpackPlugin([{ from: 'node_modules/amcharts3/amcharts/images', to: 'dist/amcharts/images' },])
        // ),
        /**
        * jQuery
        **/
        cfg.plugins.push(
          new ProvidePlugin({
             $: "jquery",
             jQuery: "jquery",
             "window.jQuery": "jquery'",
             "window.$": "jquery"
         })
       )

      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        // 'QLayout',
        // 'QLayoutHeader',
        // 'QLayoutDrawer',
        // 'QPageContainer',
        // 'QPage',
        // 'QToolbar',
        // 'QToolbarTitle',
        // 'QBtn',
        // 'QIcon',
        // 'QList',
        // 'QListHeader',
        // 'QItem',
        // 'QItemMain',
        // 'QItemSide'
      ],
      directives: [
        // 'Ripple'
      ],
      // Quasar plugins
      plugins: [
        // 'Notify'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      workboxPluginMode: 'InjectManifest',
      // workboxPluginMode: 'GenerateSW',
      // workboxOptions: { debug: false },
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
