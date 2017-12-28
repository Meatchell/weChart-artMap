//mallHome.js
//商城主页
const app = getApp()

Page({
    data: {
        artgallery:[],
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        imageArray:[]
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {

    },
    onShow: function () {
        // 页面显示
        this.getDataFromService();
    },
    getDataFromService() {
        // 获取轮播头数据
        this.getCarouseData();
    },
    updateDataSource: function (data) {
        var imageArray = data.data;
        console.log(imageArray)
        for (var i = 0; i < imageArray.length; i++) {
            var obj = imageArray[i];
            obj.img = "https://art-map.oss-cn-beijing.aliyuncs.com/" + obj.imagename;
        }
        this.setData({
            imageArray: imageArray,
        })
    },
    getCarouseData() {
        var page = this;
        wx.request({
            url: 'https://www.huangli13.cn/v1/advertisement',
            data: {},
            method: 'GET',
            success: function (res) {
                // 拿到返回的数据，处理数据
                page.updateDataSource(res.data)
            },
            fail: function () {
                // fail
                wx.showToast({
                    title: "获取数据失败",
                    duration: 2000,
                })
            },
            complete: function () {
            }
        })
    },

    ToSearch:function(event){
        console.log(event,event.currentTarget.dataset.search)
        wx.navigateTo({
            url: '../search/search?searchData='+event.currentTarget.dataset.search+"&searchType="+event.currentTarget.dataset.type,
        })
        console.log(event)
    }
})

// })
