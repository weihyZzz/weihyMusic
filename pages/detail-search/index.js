// pages/home-music/index.js
import { getSearchHot, getSearchSuggest } from '../../service/api_search'
Page({
    data: {
      hotKeywords: [],
      suggestSongs: [], //搜索建议歌曲
      searchValue: ""
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
    },
    handleSearchChange: function(event) {
      console.log('搜索框输入事件event信息：',event);
      const searchValue = event.detail
      // console.log(searchValue);
      this.setData({ searchValue })
      // 搜索内容为空则不发送请求
      if(!searchValue.length) {
        this.setData({ suggestSongs: [] })
        return 
      }
      getSearchSuggest(searchValue).then(res => {
        // console.log(res);
        this.setData({ suggestSongs: res.result.allMatch })
      })
    }

})