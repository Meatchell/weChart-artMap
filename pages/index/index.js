    //index.js
//获取应用实例
const app = getApp()

Page({  
    data: {
        artgallery: [],
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        controls:''
        //事件处理函数
    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e);
        wx.navigateTo({
            url: '../artMuseumDeatils/artMuseumDeatils'
        })
    },
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
//切换到商城主页
    // ToMallHome: function() {
    //     wx.navigateTo({
    //         url: '../mallHome/mallHome'
    //     })
    // },

    //测试页切换的博物馆详情页
    // ToMallHome: function () {
    //     wx.navigateTo({
    //         url: '../artMuseumDeatils/artMuseumDeatils'
    //     })
    // },

    onLoad: function () {
        let that = this
        // 根据屏幕大小适配商城入口位置
        wx.getSystemInfo ({
            success:function(res){
                that.setData({
                    controls: [{
                        id: 1,
                        iconPath: '../../imgs/mall-entrance.png',
                        position: {
                            left: res.windowWidth/2 -60,
                            top: res.windowHeight-120-60,  //windowHeight包括小程序头部高度
                            width: 120,
                            height: 120
                        },
                        clickable: true
                    }]
                })
            }
        })
        // wx.request({
        //     url: "https://www.huangli13.cn/v1/artgallery",
        //     success: res => {
        //         console.log(res, "------------");
        //         let artGallery = res.data.data
        //         artGallery.forEach((v, i) => {
        //             v.iconPath = 'http://art-map.oss-cn-beijing.aliyuncs.com/1_13.png';
        //             v.width = 20;
        //             v.height = 20;
        //         })
        //         console.log(artGallery);
        //         this.setData({
        //             artgallery: artGallery
        //         })
        //
        //     }
        // })
        //获取我的位置
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude

                console.log("经度" + latitude, "维度" + longitude)
            }
        })


        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }


})
