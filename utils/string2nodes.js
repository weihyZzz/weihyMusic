// 将字符串转为富文本组件的nodes结点
export default function stringToNodes(keyword, value) {
    // 字符串 "abcd",搜索框输入ab , ab和前半截匹配,文字颜色变为红色
    const nodes = []
    if (keyword.toUpperCase().startsWith(value.toUpperCase())) {
        // 满足条件说明有匹配的前缀
        // key1是匹配关键词到前半部分
        const key1 = keyword.slice(0, value.length)
        const node1 = {
            name:"span",
            attrs: { style: "color: #26ce8a; font-size: 14px;" },
            children: [ { type: "text", text: key1 } ]
        }
        nodes.push(node1)
        // key2是后半部分
        const key2 = keyword.slice(value.length)
        const node2 = {
            name: "span",
            attrs: { style: "color: #000000; font-size: 14px;" },
            children: [ { type: "text", text: key2 } ]
        }
        nodes.push(node2)
    } else {
        const node = {
            name: "span",
            attrs: { style: "color: #000000; font-size: 14px;" },
            children: [ { type: "text", text: keyword } ]
        }
        nodes.push(node)
    }
    return nodes
}