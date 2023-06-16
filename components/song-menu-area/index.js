// components/song-menu-area/index.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: "默认歌单"
        },
        songMenu: {
            type: Array,
            value: []
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        screenWidth: app.globalData.screenWidth
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleMenuItemClick: function(event) {
            // item为 当前item项对应的歌单的具体数据信息
            const item = event.currentTarget.dataset
            console.log('歌单项具体信息:', item);
            console.log('---', item.item);
            const id = item.item.id
            // console.log('------id', id);
            wx.navigateTo({
              url: `/pages/detail-songs/index?id=${id}&type=menu`,
            })
        }
    }
})
