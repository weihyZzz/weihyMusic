import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        id: 0,
        currentSong: {},
        durationTime: 0,
        lyricInfos: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",
    },
    actions: {
        playMusicWithSongIdAction(ctx, { id }) {
            ctx.id = id
            // 1.获取数据
            // 获取歌曲详情信息
            getSongDetail(id).then(res => {
                // this.setData({currentSong: r})
                // console.log(res);
                // this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
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
        }
    }
})
export {
  audioContext,
  playerStore
}