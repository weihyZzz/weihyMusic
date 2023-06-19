import diyRequest from './index'

export function getSearchHot() {
  // 获取热门搜索信息
  return diyRequest.get('/search/hot')
}

export function getSearchSuggest(keywords) {
  return diyRequest.get('/search/suggest', {
    keywords,
    type: "mobile"
  })
}