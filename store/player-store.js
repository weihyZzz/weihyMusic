import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        id: 0,
        currentSong: {},
        durationTime: 0,
        lyricInfos: []
    },
    actions: {
        playMusicWithSongIdAction(ctx, { id }) {
            ctx.id = id
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
        }
    }
})
export {
  audioContext,
  playerStore
}