// pages/detail-songs/index.js
import { rankingStore } from '../../store/index'
import { getSongMenuDetail } from '../../service/api_music'
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
        // detail-songs界面要区分入口，看type是menu还是rank
        console.log('音乐界面:', options);
        const type = options.type
        this.setData({type: type})
        const ranking = options.ranking
        this.setData({ ranking: ranking })
        if (type === "menu") {
            const id = options.id
            getSongMenuDetail(id).then( (res) => {
                this.setData({ songInfo: res.playlist })
            })
        } else {
            // 获取数据
            rankingStore.onState(ranking, this.getRankingDataHandler)
        }

        
    },
    onUnload() {

    },
    getRankingDataHandler: function(res) {
        this.setData({ songInfo: res })
    }

})