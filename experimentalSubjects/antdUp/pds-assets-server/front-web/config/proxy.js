/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2022-10-17 16:13:47
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-08 16:07:54
 * @Description:
 */
export default {
  dev: {
    '/proxy/pds/operation': {
      // 要代理的地址
      target: 'http://192.168.183.38:8099',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/pds/operation': '/pds/operation',
      },
    },
    '/proxy/lcp': {
      // 要代理的地址
      target: 'http://192.168.183.38:8065/',
      // target: 'http://10.8.34.56:8065/',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/lcp': '/lcp',
      },
    },
    '/proxy/risk': {
      // 要代理的地址
      target: 'http://192.168.183.38:8999', //服务端
      // target: 'http://10.8.34.70:8888/', //陈炎
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/risk': '/risk',
      },
    },
    '/proxy/chat': {
      target: ' http://192.168.183.102:7861', //服务端
      // target: 'http://10.8.34.70:8888/', //陈炎
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/chat': '/chat',
      },
    },
    // '/proxy/assets360': {
    //   // 要代理的地址
    //   target: 'http://localhost:8068', //朝荣
    //   // target: 'http://10.8.34.41:8068', //朝荣
    //   // target: 'http://10.8.34.33:8068', //鑫城
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/proxy/assets360': '/assets360',
    //   },
    // },
    '/proxy': {
      // 要代理的地址
      target: 'http://192.168.183.38:8839/',
      // target: 'http://10.8.34.94:8089/',//伟哲
      // target: 'http://10.8.34.37:8069/',
      //  target: 'http://192.168.183.33:8089/',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': '',
      },
    },

    '/liveDataSync': {
      // 要代理的地址
      target: 'http://192.168.183.53:9091',
      changeOrigin: true,
    },
  },
};
