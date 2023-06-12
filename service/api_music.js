import diyRequest from './index'
export function getBanners() {
    return diyRequest.get("/banner", {
        type: 2
    })
}

// 获取热门音乐榜单
export function getRankings(id) {
    // return diyRequest.get("/artist/top/song?id=6452")
    return diyRequest.get("/playlist/detail", {
        id
    })
}

// 获取歌单
export function getSongMenu(cat="全部", limit=6, offset=0) {
    return diyRequest.get("/top/playlist", {
        cat,
        limit,
        offset
    })
}