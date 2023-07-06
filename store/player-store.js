import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()//支持背景音频播放
const playerStore = new HYEventStore({
    state: {
        id: 0,
        currentSong: {},
        durationTime: 0,
        lyricInfos: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        playModeIndex: 0, //标识播放状态 0:顺序播放 1: 单曲循环 2: 随机播放
        isPlaying: false, //标识音乐播放状态
        playListSongs: [],//缓存当前播放歌曲所在的歌单列表，用于实现上一首下一首功能
        playListIndex: 0 // 缓存当前播放歌曲在歌单列表中的序号
    },
    actions: {
        playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
            // 如果还是同一首歌，就不再次请求音乐
            if (ctx.id == id && !isRefresh) {
                this.dispatch("changeMusicPlayStatusAction", true)
                return
            }
            ctx.id = id
            // 0.改变音乐播放状态,(擦除上一首歌曲的缓存，避免点击新歌曲，展示上一首歌曲的信息)
            ctx.isPlaying = true
            ctx.currentSong = {}
            ctx.lyricInfos = []
            ctx.currentTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""
            // 1.获取数据
            // 获取歌曲详情信息
            getSongDetail(id).then(res => {
                // this.setData({currentSong: r})
                // console.log(res);
                // this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
                console.log('name信息',  res.songs[0].name);
                audioContext.title = res.songs[0].name
            })
            // 获取歌词信息
            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric
                const lyrics = parseLyric(lyricString)
                ctx.lyricInfos = lyrics
            })
            // 2.播放歌曲
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true
            audioContext.title = id //如果要支持小程序退出后台依然可以播放，就不能注释掉
            // 3.监听audioContext的事件
            this.dispatch("setupAudioContextListenerAction")
        },
        setupAudioContextListenerAction(ctx) {
            // 1.监听歌曲可以播放
            audioContext.onCanplay(() => {
                audioContext.play()
              })
            // 2.监听播放音乐时间的改变
            audioContext.onTimeUpdate(() => {
                // 1.获取当前音乐时间(返回的是秒，转换成毫秒)
                const currentTime =  audioContext.currentTime * 1000
                // 2.根据当前时间修改currentTime
                ctx.currentTime = currentTime
                // 3.根据当前时间去寻找播放的歌词
                if (!ctx.lyricInfos.length) return
                let i = 0
                for(; i < ctx.lyricInfos.length; i++) {
                    const lyricInfo = ctx.lyricInfos[i]
                    if(currentTime < lyricInfo.time) {
                        // 如果当前时间小于 当前歌词项的时间，则 显示的则是当前项的前一项
                        break
                    }
                }
                // 设置当前歌词的索引和内容
                const currentIndex = i - 1
                if (ctx.currentLyricIndex !== currentIndex) {
                const currentLyricInfo = ctx.lyricInfos[currentIndex]
                ctx.currentLyricIndex = currentIndex
                ctx.currentLyricText = currentLyricInfo.text
                }
            })
            // 3.监听歌曲播放完成
            audioContext.onEnded(() => {
                this.dispatch("changeNewMusicAction")
            })
        },
        changeMusicPlayStatusAction(ctx, isPlaying = true) {
            ctx.isPlaying = isPlaying
            if (ctx.isPlaying) audioContext.play()
            else audioContext.pause()
        },
        changeMusicPlayModeAction(ctx) {
            // 0:顺序播放 1: 单曲循环 2: 随机播放
            let playModeIndex = ctx.playModeIndex + 1
            if (playModeIndex === 3) playModeIndex = 0
            ctx.playModeIndex = playModeIndex
            let map = {0: '顺序播放', 1: '单曲循环', 2:'随机播放'}
            console.log('当前播放模式', map[playModeIndex] );
        },
        changeNewMusicAction(ctx, isNext = true) {
            
            // 点击上一首，下一首，进行新歌曲的播放
            // 1.获取当前歌曲对应的索引
            let index = ctx.playListIndex
            // 2.根据播放模式来更新下一首歌曲的索引
            switch(ctx.playModeIndex) {
                case 0:
                    index = isNext ? index + 1 : index - 1
                    if(index == -1) index = ctx.playListSongs.length - 1
                    if(index == ctx.playListSongs.length) index = 0
                    break
                case 1:
                    // case1为单曲循环
                    break
                case 2:
                    // 随机播放
                    index = Math.floor(Math.random() * ctx.playListSongs.length)
                    break;
            }
            // 3.根据新索引获取歌曲信息
            console.log('新歌曲index:', index);
            let currentSong = ctx.playListSongs[index]
            ctx.playListIndex = index //更新最新的playListIndex
            // 4.播放新歌曲
            this.dispatch("playMusicWithSongIdAction", {id: currentSong.id, isRefresh: true})
        }
    }
})
export {
  audioContext,
  playerStore
}