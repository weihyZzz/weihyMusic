// pages/home-music/index.js
import { getBanners } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000)
Page({
    data: {
        banners: [],
        swiperHeight: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        this.getPageData()
    },
    // 网络请求函数
    getPageData: async function() {
        const res = await getBanners()
        console.log(res);
        this.setData({ banners: res.banners })
    },
    handleSearchClick: function() {
        console.log('点击搜索框');
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },
    handleSwiperImageLoaded: function() {
        // 获取.swiper-image的矩形框高度
        throttleQueryRect('.swiper-image').then(res => {
            const rect = res[0]
            this.setData({ swiperHeight: rect.height })
        })
    }
})