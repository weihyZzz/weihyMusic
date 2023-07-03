// pages/music-player/index.js

import { getSongDetail, getSongLyric } from '../../service/api_player'
import { audioContext } from '../../store/index'
import { parseLyric } from '../../utils/parse-lyric'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: 0,
      currentSong: {},
      currentPage: 0,
      contentHeight: 0,
      lyricInfos: [],
      currentLyricIndex: 0,//缓存当前歌词序号
      currentLyricText: "",//缓存当前歌词内容

      isMusicLyric: true,
      durationTime: 0,
      currentTime: 0,
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
        // 4.采用audioContext播放音乐
        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.autoplay = true
        // 5.audioContext事件监听
        this.setupAudioContextListener()
    },
    // ========================   网络请求   ======================== 
    getPageData: function(id) {
        // 获取歌曲详情信息
        getSongDetail(id).then(res => {
            // this.setData({currentSong: r})
            console.log(res);
            this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
        })
        // 获取歌词信息
        getSongLyric(id).then(res => {
          const lyricString = res.lrc.lyric
          // console.log(lyricString);
          const lyricInfos = parseLyric(lyricString)
          // console.log('lyricInfos', lyricInfos);
          this.setData({lyricInfos: lyricInfos})
        })
    },
      // ========================   audio监听   ======================== 
    setupAudioContextListener: function() {
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 监听播放音乐时间的改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前音乐时间(返回的是秒，转换成毫秒)
        const currentTime =  audioContext.currentTime * 1000
        // console.log(currentTime);
       
        // 2.根据当前时间修改sliderValue
        if(!this.data.isSliderChanging) {
          //只有没在滑动的时候才可以更改sliderValue
          const sliderValue = currentTime / this.data.durationTime * 100
          this.setData({sliderValue, currentTime})
        }
        // 3.根据当前时间来查找播放到的具体歌词
        let i = 0
        for(; i < this.data.lyricInfos.length; i++) {
          const lyricInfo = this.data.lyricInfos[i]
          if(currentTime < lyricInfo.time) {
            // 如果当前时间小于 当前歌词项的时间，则 显示的则是当前项的前一项
            break
          }
        }
        // break跳出循环则找到当前歌词的索引
        const currentIndex= i - 1
        if (this.data.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = this.data.lyricInfos[currentIndex]
          this.setData({ currentLyricIndex: currentIndex, currentLyricText:currentLyricInfo.text })
          this.setData({ lyricScrollTop: this.data.currentLyricIndex*35 })
        }
      })
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
      audioContext.pause()
      // seek API需要转换成 以秒为单位
      audioContext.seek(currentTime / 1000)
      // 4.记录最新的sliderValue
      this.setData({sliderValue: value,isSliderChanging: false})
    },
    // slider滑动处理
    handleSliderChanging: function(event) {
      const value = event.detail.value
      const currentTime = this.data.durationTime * value / 100
      this.setData({isSliderChanging: true, currentTime: currentTime, sliderValue: value})
      console.log('滑动中，禁止更改sliderValue');
    } 
})