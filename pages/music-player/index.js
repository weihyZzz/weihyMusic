// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: 0,
      currentSong: {}
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
    },
    getPageData: function(id) {
        getSongDetail(id).then(res => {
            // this.setData({currentSong: r})
            console.log(res);
            this.setData({ currentSong: res.songs[0] })
        })
    }
})