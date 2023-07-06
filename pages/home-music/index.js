// pages/home-music/index.js
import { getBanners, getSongMenu } from '../../service/api_music'

import { playerStore, rankingStore } from '../../store/index'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })
Page({
    data: {
        banners: [],
        swiperHeight: 0,
        recommendSongs: [],
        hotSongMenu: [],
        recommendSongMenu: [],
        netWorkSongs: [], //网络热歌榜
        newSongs: [], //新歌榜
        hipopSongs: [], //云音乐说唱榜
        rankings: { 'netWorkHotRanking': {}, 'newRanking': {}, 'hipopRanking': {} },

        currentSong: {},//
        isPlaying: false,
        playAnimState: "pause"
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        playerStore.dispatch("playMusicWithSongIdAction", { id: 1974443814 })

        this.getPageData()
        
        // 发起共享数据的请求
        rankingStore.dispatch("getRankingDataAction")

        // 从store获取共享数据
        rankingStore.onState("hotRanking", (res) => {
            if(!res.tracks) return 
            const recommendSongs = res.tracks.slice(0,6)
            this.setData({recommendSongs})
        })
        rankingStore.onState("netWorkHotRanking", (res) => {
            if(!res.tracks) return
            const netWorkSongs = res.tracks.slice(0,3)
            this.setData({ netWorkSongs: netWorkSongs})
        })
        // 给rankings赋值
        rankingStore.onState("newRanking", this.getRankingHandler("newRanking"))
        rankingStore.onState("netWorkHotRanking", this.getRankingHandler("netWorkHotRanking"))
        rankingStore.onState("hipopRanking", this.getRankingHandler("hipopRanking"))

        // 播放器监听
        playerStore.onStates(["currentSong","isPlaying"], ({currentSong, isPlaying}) => {
            if (currentSong) this.setData({ currentSong })
            if(isPlaying !== undefined) {
                console.log('isPlaying', isPlaying);
                this.setData({ isPlaying: isPlaying, playAnimState: isPlaying?'running': 'paused' })
            }
        })
    },
    // 网络请求函数
    getPageData: async function() {
        const res = await getBanners()
        const res2 = await getSongMenu()
        const res3 = await getSongMenu("华语")
        console.log(res);
        this.setData({ banners: res.banners })
        this.setData({ hotSongMenu: res2.playlists })
        this.setData({ recommendSongMenu: res3.playlists })
    },
    handleSearchClick: function() {
        console.log('点击搜索框');
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },
    handleSwiperImageLoaded: function() {
        // 获取.swiper-image的矩形框高度
        throttleQueryRect('.swiper-image').then(res => {
            const rect = res[0]
            this.setData({ swiperHeight: rect.height })
        })
    },
    // 获取store中的榜单数据，并进行进一步处理
    getRankingHandler: function(rankingName) {
        return (res) => {
            if (Object.keys(res).length === 0) return
            console.log('res', res)
            const name = res.name
            const coverImgUrl = res.coverImgUrl
            const songList = res.tracks.slice(0, 3)
            const playCount = res.playCount
            const rankingObj = {name, coverImgUrl, songList, playCount} //构造榜单对象
            // 要重点理解下面这种赋值方式，将旧数据和处理后的数据进行合并
            const newRankings = { ...this.data.rankings, [rankingName]: rankingObj } 
            this.setData({
                rankings: newRankings
            })
        }
    },
    handlePlayBtnClick: function(){
        console.log('点击底部播放栏按钮');
        playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
    },
    handleBarClick: function() {
        wx.navigateTo({
          url: '/pages/music-player/index',
        })
    },
    handleMoreClick: function() {
        // console.log('点击推荐歌曲的更多按钮');
        // wx.navigateTo({
        //   url: '/pages/detail-songs/index',
        // })
        this.navigateToDetailSongPage("hotRanking")
    },
    // 点击巅峰榜中的榜单选项
    handleRankingItemClick: function(event) {
        const idx = event.currentTarget.dataset.idx
        console.log('点击巅峰榜',event.currentTarget.dataset.idx);
        this.navigateToDetailSongPage(idx)
    },
    navigateToDetailSongPage: function(rankingName) {
        wx.navigateTo({
          url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
        })
    },
    handleSongItemClick: function(event) {
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListSongs", this.data.recommendSongs)
        playerStore.setState("playListIndex", index)
        console.log('index',index,this.data.recommendSongs);
    }
})