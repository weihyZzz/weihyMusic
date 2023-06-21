// pages/music-player/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const id = options.id
      this.setData({id: id})
    },
})