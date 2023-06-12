// // app.js
App({
    onLaunch: function() {
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        console.log('info:', info);
    },
    globalData: {
      screenWidth: 0,
      screenHeight: 0
    }
})

  