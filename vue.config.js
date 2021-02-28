module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://jshg.tpddns.cn:8011',//生产
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                },
                headers: {

                }
            }
        }
    },
    lintOnSave: false
}
