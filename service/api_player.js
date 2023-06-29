import diyRequest from './index'
export function getSongDetail(ids) {
  return diyRequest.get('/song/detail', {
      ids
  })
}
export function getSongLyric(id) {
  return diyRequest.get('/lyric', {
    id
  })
}