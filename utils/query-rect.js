// 查询某个组件的矩形框高度
export default function (selector) {
    return new Promise((resolve) => {
        const query = wx.createSelectorQuery()
        // Rect矩形内包含宽度和高度
        query.select(selector).boundingClientRect()
        query.exec((res) => {
            resolve(res)
        })
    })  
}