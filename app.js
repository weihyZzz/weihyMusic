// // app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'
App({
    onLaunch: async function() {
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        this.globalData.statusBarHeight = info.statusBarHeight
        // 计算设备屏幕的宽高比
        const deviceRadio = info.screenHeight / info.screenWidth
        this.globalData.deviceRadio = deviceRadio
        console.log('宽高比:', deviceRadio);
        // 获取token
        const token = wx.getStorageSync(TOKEN_KEY)
        // token有没有过期
        const checkResult = await checkToken(token)
        console.log('checkResult', checkResult);
        // 检查session是否过期
        const isSessionExpire = await checkSession()
        console.log('session已经过期?', isSessionExpire);
        if(!token || checkResult.errorCode || !isSessionExpire) {
            this.loginAction()
        }
        // this.loginAction()
    },
    loginAction: async function() {
        // 1. 获取code
        const code = await getLoginCode()
        console.log('code', code);
        // 2.将code发送给服务器
        const result = await codeToToken(code)
        const token = result.token
        console.log('token:', token);
        wx.setStorageSync(TOKEN_KEY, token)
    },
    globalData: {
        screenWidth: 0,
        screenHeight: 0,
        statusBarHeight: 0,
        navBarHeight: 44,
        deviceRadio: 0
      }
})

  