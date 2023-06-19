// 采用hy-event-store来做类似于vuex的状态管理（建议后续集成，不用第三方npm包）
import { HYEventStore } from 'hy-event-store'
import { getRankings } from '../service/api_music'

const rankingStore = new HYEventStore({
    state: {
        hotRanking: {}, //热歌榜（实际用来展示推荐歌曲）
        netWorkHotRanking: {}, //网络热歌榜
        newRanking: {}, //新歌榜
        hipopRanking: {} //云音乐说唱榜
    },
    actions: {
        getRankingDataAction(ctx) {
            // 获取推荐歌曲到逻辑是请求特检歌曲接口，传入的具体id则是不同榜单对应的id，返回结果则是该榜单包含的歌曲
            // 默认榜单: 1
            // 热歌榜： 3778678
            // 网络热歌榜： 6723173524
            // 新歌榜： 3779629
            // 云音乐说唱榜：991319590
            getRankings(3778678).then(res => {
                ctx.hotRanking = res.playlist
                // console.log('热歌榜', res);
            })
            getRankings(6723173524).then(res => {
                ctx.netWorkHotRanking = res.playlist
                // console.log('网络热歌榜', res);
            })
            getRankings(3779629).then(res => {
                ctx.newRanking = res.playlist
                // console.log('新歌榜', res);
            })
            getRankings(991319590).then(res => {
                ctx.hipopRanking = res.playlist
                // console.log('说唱榜', res);
            })
        }
    }
})

export {
    rankingStore
}

