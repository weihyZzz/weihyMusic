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
      contentHeight: 0,

      isMusicLyric: true,
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
       const deviceRadio = globalData.deviceRadio
       const contentHeight = screenHeight - statusBarHeight - navBarHeight
       this.setData({contentHeight})
        //屏幕宽高比大于2则显示歌曲页面的歌词view
       this.setData({isMusicLyric: deviceRadio>=2})
        // 4.创建播放器
        const audioContext = wx.createInnerAudioContext()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.play()
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