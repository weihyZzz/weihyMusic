// // app.js
App({
    onLaunch: function() {
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        this.globalData.statusBarHeight = info.statusBarHeight
        // 计算设备屏幕的宽高比
        const deviceRadio = info.screenHeight / info.screenWidth
        this.globalData.deviceRadio = deviceRadio
        console.log('宽高比:', deviceRadio);
    },
    globalData: {
        screenWidth: 0,
        screenHeight: 0,
        statusBarHeight: 0,
        navBarHeight: 44,
        deviceRadio: 0
      }
})

  