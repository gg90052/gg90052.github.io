const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",
  configureWebpack: {
    resolve: {
      alias: {
        "@": "/src",
        store: "/src/store",
      },
    },
    plugins: [
      require("unplugin-auto-import/webpack")({
        imports: ["vue", "vue-router"],
        dts: false,
      }),
    ],
  },
  // devServer: {
  //   proxy: {      
  //     [process.env.VUE_APP_API]: {
  //       target: 'https://www.vndlive.com:51443',
  //       changeOrigin: true,
  //       secure: false,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     },
  //   }
  // }
});
