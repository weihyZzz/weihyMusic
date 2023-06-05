// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRelatedVideo } from '../../service/api_video'
Page({
    data: {
        id: 0,
        mvURLInfo: {},
        mvDetail: {},
        relatedVideos: []
    },
    onLoad: async function(options) {
        const id = options.id
        this.setData({id: id})
        // const res = await getMVURL(id)
        // this.setData({mvURLInfo: res.data})
        this.getPageData(id)
    },
    // 获取页面信息
    getPageData: function(id) {
        // 1.请求播放地址
        getMVURL(id).then(res => {
            this.setData({mvURLInfo: res.data})
        })
        // 2.请求视频详情
        getMVDetail(id).then(res => {
            this.setData({mvDetail: res.data})
        })
        // 3.请求相关视频
        getRelatedVideo(id).then(res => {
            this.setData({relatedVideos: res.data})
        })
    }

})