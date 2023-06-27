// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: 0,
      currentSong: {},
      currentPage: 0,
      contentHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 1.获取传入id
      const id = options.id
      this.setData({id: id})
        // 2.根据id获取歌曲详情信息
      this.getPageData(id)
       //  3.动态计算内容页高度
       const globalData = getApp().globalData
       const screenHeight = globalData.screenHeight
       const statusBarHeight = globalData.statusBarHeight
       const navBarHeight = globalData.navBarHeight
       const contentHeight = screenHeight - statusBarHeight - navBarHeight
       this.setData({contentHeight})
    },
    getPageData: function(id) {
        getSongDetail(id).then(res => {
            // this.setData({currentSong: r})
            console.log(res);
            this.setData({ currentSong: res.songs[0] })
        })
    },
    // 事件处理
    handleSwiperChange: function(event) {
        const current = event.detail.current
        this.setData({currentPage: current})
    }
})