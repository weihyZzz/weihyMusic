// pages/home-music/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/api_search'
import stringToNodes from '../../utils/string2nodes'
import debounce from '../../utils/debounce'
// 给搜索建议函数加防抖
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)
Page({
    data: {
      hotKeywords: [],
      suggestSongs: [], //搜索建议歌曲
      suggestSongNodes: [],
      resultSongs: [],
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
        // 1.获取输入的关键字
        // console.log('搜索框输入事件event信息：',event);
        const searchValue = event.detail
        // console.log(searchValue);
        // 2.保存关键字
        this.setData({ searchValue })
        // 3.判断关键字为空字符的处理逻辑
        if(!searchValue.length) {
            this.setData({ suggestSongs: [] })
            this.setData({ resultSongs: [] })
            return 
        }
        // 4.根据关键字搜索
        debounceGetSearchSuggest(searchValue).then(res => {
            // console.log(res);
            // 1.保存关键字相关的歌曲
            const suggestSongs = res.result.allMatch
            this.setData({ suggestSongs: suggestSongs})
            // 2.处理成nodes结点
            const suggestKeywords = suggestSongs.map(item => item.keyword)
            const suggestSongNodes = []
            for (const keyword of suggestKeywords) {
                const nodes = stringToNodes(keyword, searchValue)
                suggestSongNodes.push(nodes)
            }
            this.setData({ suggestSongNodes })
            console.log('----存储成功');
        })
    },
    handleSearchAction: function() {
      const searchValue = this.data.searchValue
      getSearchResult(searchValue).then(res => {
        console.log('res',res);
        this.setData({ resultSongs: res.result.songs })
      })
    },
    handleKeywordItemClick: function(event) {
      // 1.获取点击的关键词
      const keyword = event.currentTarget.dataset.keyword
      this.setData({searchValue: keyword})
      // 2.发送网络请求
      this.handleSearchAction()
      // console.log(keyword);
    }

})