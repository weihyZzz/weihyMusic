// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRelatedVideo, getMVComments } from '../../service/api_video'
Page({
    data: {
        id: 0,
        mvURLInfo: {},
        mvDetail: {},
        relatedVideos: [],
        mvComments: []
    },
    formatTimestamp: function(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    onLoad: async function(options) {
        const id = options.id
        this.setData({id: id})
        // const res = await getMVURL(id)
        // this.setData({mvURLInfo: res.data})
        this.getPageData(id)
    },
    // 时间戳转换
    
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
        // 4.请求视频评论
        getMVComments(id).then(res => {
            // console.log('视频评论', res.comments);
            let comments = res.comments
            comments.forEach(item => {
                const time = item.time
                console.log('time', time);
                const processTime = this.formatTimestamp(time)
                console.log('process', processTime);
                item.time = processTime
            })
            this.setData({mvComments: comments})
        })
    }

})