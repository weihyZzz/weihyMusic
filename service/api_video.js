import diyRequest from './index'
export function getTopMV(offset, limit = 10) {
    return diyRequest.get("/top/mv", {
        offset,
        limit
    })
}

/**
 * 通过id请求视频的播放地址
 * @param {number} id 
 */
export function getMVURL(id) {
    return diyRequest.get("/mv/url", {
        id: id
    })
}
/**
 * 请求MV的详情信息
 * @param {number} mvid 
 */
export function getMVDetail(mvid) {
    return diyRequest.get("/mv/detail", {
        mvid
    })
}
/**
 *  请求MV的相关视频信息
 * @param {number} id 
 */
export function getRelatedVideo(id) {
    return diyRequest.get("/related/allvideo", {
        id
    })
}

export function getMVComments(id) {
    return diyRequest.get("/comment/video", {
        id
    })
}
