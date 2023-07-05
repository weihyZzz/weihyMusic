// 处理歌词,将一个长字符串进行拆分，最终将歌词处理成一个对象数组，每一个对象包含两项：时间和歌词

// 正则处理 时间项[02:22.14]
const timeRegExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
export function parseLyric(lyricString) {
  // 1.通过\n做拆分
  const lyricStrings = lyricString.split('\n')
  // 2.拆分后每一项的格式为 "[02:22.14]那么当你听到这首歌的时候"
  // 需要将字符串做个转换，处理成为一个对象{time:xxx,lyric:xxx}
  // console.log(lyricStrings);
  const lyricInfos = []
  for (const lineString of lyricStrings) {
    // 对每个字符串执行正则
    const timeResult = timeRegExp.exec(lineString)
    if(!timeResult) continue
    // console.log('timeResult时间项:', timeResult);
    // 1.获取分、秒、毫秒项，然后分别相加算出总时间(均转化为毫秒)
    // 注意做数字转换，不然有些歌曲歌词会有问题
    const minute = parseInt(timeResult[1]*60*1000)
    
    const second = parseInt(timeResult[2]*1000)
    const millsecondTime = parseInt(timeResult[3])
    const millsecond = timeResult[3].length === 2 ? millsecondTime * 10 : millsecondTime
    const time = minute + second + millsecond
    
    // 2.获取对应歌词
    const text = lineString.replace(timeRegExp,"") //把匹配的时间换成“”,剩下的就是歌词
    // console.log('当前项总时间(以毫秒为单位)', time,'当前歌词', text);
    lyricInfos.push({ time, text })
  }
  return lyricInfos
}