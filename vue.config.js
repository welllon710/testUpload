const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@/assets',resolve('src/assets'))
	  .set('@/components',resolve('src/components'))
	  .set('@/view',resolve('src/view'))
	  .set('@/common',resolve('src/common'))

      // 这里只写了两个个，你可以自己再加，按这种格式.set('', resolve(''))
  },
devServer: {
    proxy: {  //配置跨域
      '/file': {
        target: 'http://42.192.92.208:90',  //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true,  //允许跨域
        pathRewrite: {
          /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
            实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
           */
          '^/file': '' 
        }
      },
    }
  },	
};