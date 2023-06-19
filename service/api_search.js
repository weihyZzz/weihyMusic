import diyRequest from './index'

export function getSearchHot() {
  // 获取热门搜索信息
  return diyRequest.get('/search/hot')
}