module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://106.54.85.20:8011',//生产
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
