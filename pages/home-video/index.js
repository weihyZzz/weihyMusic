// pages/home-music/index.js
import { getTopMV } from '../../service/api_video'
Page({
    data: {
        topMVs: [],
        hasMore: true
    },
    onLoad: async function (options) {
        this.getTopMVData(0)
    },
    getTopMVData: async function(offset) {
        // 判断是否有更多数据，没有则不进行请求
        if(!this.data.hasMore) {
            console.log('无剩余请求数据');
            return
        }
        // 在当前页面显示导航条加载动画
        wx.showNavigationBarLoading()
        // 请求数据
        const res = await getTopMV(offset)
        let newData = this.data.topMVs
        if (offset === 0) {
            // 第一次请求
            newData = res.data
        } else {
            // 后续下拉请求，需要将新请求的列表和原数据进行合并
            newData = newData.concat(res.data)
        }
        // 设置数据
        this.setData({ topMVs: newData })
        this.setData({ hasMore: res.hasMore })
        wx.hideNavigationBarLoading()
        if (offset === 0) {
            wx.stopPullDownRefresh()
        }
    },
    onPullDownRefresh: async function () {
        this.getTopMVData(0)
    },
    onReachBottom: async function () {
        // 例如一开始10条数据，则执行下方函数请求 11-20条
        this.getTopMVData(this.data.topMVs.length)
    },
    handleVideoItemClick: function (event) {
        console.log('点击', event);
        const id = event.currentTarget.dataset.item.id
        console.log('当前项视频对应id:', id);
        wx.navigateTo({
          url: `/pages/detail-video/index?id=${id}`,
        })
    }
})