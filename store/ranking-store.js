// 采用hy-event-store来做类似于vuex的状态管理（建议后续集成，不用第三方npm包）
import { HYEventStore } from 'hy-event-store'
import { getRankings } from '../service/api_music'

const rankingStore = new HYEventStore({
    state: {
        hotRanking: {}
    },
    actions: {
        getRankingDataAction(ctx) {
            getRankings(1).then(res => {
                ctx.hotRanking = res.playlist
            })
        }
    }
})

export {
    rankingStore
}

