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


// 获取歌单详情：名字、具体歌曲等等信息
export function getSongMenuDetail(id) {
    // 传入参数：歌单id
    return diyRequest.get("/playlist/detail", {
        id
    })
}