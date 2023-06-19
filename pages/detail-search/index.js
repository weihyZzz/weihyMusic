// pages/home-music/index.js
import { getSearchHot } from '../../service/api_search'
Page({
    data: {
      hotKeywords: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.getPageData()
    },
    getPageData: function() {
      getSearchHot().then(res => {
        console.log('热门搜索信息:', res);
        const hots = res.result.hots
        this.setData({ hotKeywords: hots })
      })
    }

})