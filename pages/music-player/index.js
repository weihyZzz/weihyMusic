// pages/music-player/index.js

// import { getSongDetail, getSongLyric } from '../../service/api_player'
import { audioContext, playerStore } from '../../store/index'
// import { parseLyric } from '../../utils/parse-lyric'
const playModeNames = ["order", "repeat", "random"]
Page({
    /**
     * 页面的初始数据
     */
    data: {
      id: 0,

      currentSong: {},
      currentPage: 0,
      lyricInfos: [],

      contentHeight: 0,

      currentTime: 0,
      currentLyricIndex: 0,//缓存当前歌词序号
      currentLyricText: "",//缓存当前歌词内容

      isMusicLyric: true,
      durationTime: 0,
        
      isPlaying: false,
      playingName: 'pause',

      playModeIndex: 0,
      playModeName: "order",

      sliderValue: 0,
      isSliderChanging: false, //标志是否在拖动滑动条

      lyricScrollTop: 0 //操作歌词滚动距离
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 1.获取传入id
      const id = options.id
      this.setData({id: id})
        // 2.根据id获取歌曲详情信息
        // this.getPageData(id)
        this.setupPlayerStoreListener()
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
        // 4.采用audioContext播放音乐
        // audioContext.stop()
        // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // audioContext.autoplay = true
        // 5.audioContext事件监听
        // this.setupAudioContextListener()
    },
    // 事件处理
    handleSwiperChange: function(event) {
        const current = event.detail.current
        this.setData({currentPage: current})
    },
    // slider点击处理
    handleSliderChange: function(event) {
      // console.log('slider: ',event);
      // 1.获取slider当前的值
      const value = event.detail.value
      // 2.转换成需要跳转的音乐的秒数
      const currentTime = this.data.durationTime * value / 100
      // 3.设置context播放currentTime位置处的音乐
    //   audioContext.pause()
      // seek API需要转换成 以秒为单位
      audioContext.seek(currentTime / 1000)
      // 4.记录最新的sliderValue
      this.setData({sliderValue: value,isSliderChanging: false})
    },
    // slider滑动处理
    handleSliderChanging: function(event) {
      const value = event.detail.value
      const currentTime = this.data.durationTime * value / 100
      this.setData({isSliderChanging: true, currentTime: currentTime})
    //   console.log('滑动中，禁止更改sliderValue');
    },
    // 数据监听
    setupPlayerStoreListener: function() {
        // onStates可以同时监听多个状态
        // 1.监听currentSong/durationTime/lyricInfos
        playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
            currentSong,
            durationTime,
            lyricInfos
        }) => {
            // 监听状态时，如果其中某一个没更新，则不会返回。所以先判断是否为空
            if (currentSong) this.setData({ currentSong })
            if (durationTime) this.setData({ durationTime })
            if (lyricInfos) this.setData({ lyricInfos })
        })
        // 2.监听currentTime/currentLyricIndex/currentLyricText
        playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
            currentTime,
            currentLyricIndex,
            currentLyricText
        }) => {
            if (currentTime && !this.data.isSliderChanging) {
                // 计算slider的值
                const sliderValue = currentTime / this.data.durationTime * 100
                this.setData({sliderValue, currentTime})
            }
            if (currentLyricIndex) {
                // 歌词变化，则更新歌词页面的scrollTop
                this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
            }
            if (currentLyricText) {
                this.setData({ currentLyricText })
            }
        })
        // 3.监听播放模式相关的数据，例如playModeIndex
        playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
            if (playModeIndex !== undefined) {
                // 更新播放模式
                this.setData({ playModeIndex, playModeName:  playModeNames[playModeIndex]})
            }
            if (isPlaying !== undefined) {
                // pause: 播放状态， resume 暂停状态
                this.setData({ isPlaying, playingName: isPlaying ? "pause":"resume" })
            }
        })
    },
    handleBackClick: function() {
        wx.navigateBack()
    },
    handleModeBtnClick: function() {
        // 方法1: 直接修改
        // // 计算点击后的新playModeIndex 满3则变为0
        // let playModeIndex = this.data.playModeIndex + 1
        // if (playModeIndex === 3) playModeIndex = 0
        // // 更新状态管理中的playModeIndex
        // playerStore.setState("playModeIndex", playModeIndex)
        
        // 方法2:派发到状态管理库进行修改
        playerStore.dispatch("changeMusicPlayModeAction")
    },
    handlePlayBtnClick: function() {
        // 播放按钮涉及到音乐的播放与暂停，因此发送事件到状态管理库进行操作
        playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
    },
    handlePrevBtnClick: function() {
        console.log('点击上一首');
        playerStore.dispatch("changeNewMusicAction", false)
    },
    handleNextBtnClick: function() {
        console.log('点击下一首');
        playerStore.dispatch("changeNewMusicAction")
    },
    handleSongsList: function() {
        this.navigateToDetailSongPage("hotRanking")
    },
    navigateToDetailSongPage: function(rankingName) {
        wx.navigateTo({
          url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
        })
    },
})