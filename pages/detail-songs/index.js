// pages/detail-songs/index.js
import { rankingStore } from '../../store/index'
Page({

    data: {
        type: "",
        ranking: "",
        songInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('音乐界面:', options);
        const type = options.type
        this.setData({type: type})
        const ranking = options.ranking
        this.setData({ ranking: ranking })


        // 获取数据
        rankingStore.onState(ranking, this.getRankingDataHandler)
    },
    onUnload() {

    },
    getRankingDataHandler: function(res) {
        this.setData({ songInfo: res })
    }

})