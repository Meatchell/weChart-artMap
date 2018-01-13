//mallHome.js
//商城主页
const app = getApp()

Page({
    data: {
        artgallery:[],
        imageArray:[],
        showMoreInfo:[],
        url:''
    },
    //事件处理函数
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
        for (var i = 0; i < imageArray.length; i++) {
            var obj = imageArray[i];
            obj.img = "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/" + obj.imagename;
        }
        console.log(imageArray)
        this.setData({
            imageArray: imageArray,
        })
    },
    getCarouseData() {
        var page = this;
        wx.request({
            url: 'https://www.szartmap.com/v1/advertisement',
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
        wx.navigateTo({
            url: '../search/search?searchData='+event.currentTarget.dataset.search+"&searchType="+event.currentTarget.dataset.type,
        })
    },
    showMoreInfo:function(e){
        console.log(e)

            if(e.currentTarget.dataset.contentimg){
                wx.previewImage({
                    urls: ["https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+e.currentTarget.dataset.contentimg]
                })
            }

        // }

    }
})

// })
