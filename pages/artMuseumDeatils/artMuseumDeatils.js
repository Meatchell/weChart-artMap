const app = getApp()

Page({
    data: {
        artgallery: [],
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        artGalleryDeatils: {},
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        // let artGalleryDeatils = []
        // let swiperImg = document.getElementById('swiperImg');
        // let swiperImg = selectorQuery.select('swiperImg')
        // wx.createSelectorQuery().select('#the-id')
        // console.log(swiperImg.width)

        // var query = wx.createSelectorQuery()
        // query.select('#swiperImg').boundingClientRect()
        // query.selectViewport().scrollOffset()
        // query.exec(function(res){
        //     console.log(res)
        //     res[0].top       // #the-id节点的上边界坐标
        //     res[1].scrollTop // 显示区域的竖直滚动位置
        // })
        wx.request({
            url: "https://www.huangli13.cn/v1/artgallery/info?artGallery_id=64978385109496",
            success: res => {
                let artGalleryDeatils = res.data.data
                let imgInfoArr = []
                if (artGalleryDeatils.artworks instanceof Array) {
                    res.data.data.artworks.forEach((v, i) => {
                        v.coverimg = "https://art-map.oss-cn-beijing.aliyuncs.com/" + v.coverimg
                        wx.request({
                            url: v.coverimg + "?x-oss-process=image/info",
                            success: res => {
                                v.coverimgInfo = Math.floor((res.data.ImageWidth.value / res.data.ImageHeight.value) * 280)
                                imgInfoArr.push({index: i, value: v.coverimgInfo})
                                if (imgInfoArr.length == artGalleryDeatils.artworks.length) {  //所有图片请求完成
                                    var compare = function (obj1, obj2) {
                                        var val1 = obj1.index;
                                        var val2 = obj2.index;
                                        if (val1 < val2) {
                                            return -1;
                                        } else if (val1 > val2) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                    imgInfoArr.sort(compare);
                                    console.log(imgInfoArr, '++++++++++++++++++++');
                                    let tempImgInfoArr = []
                                    imgInfoArr.forEach(function (v, i) {
                                        tempImgInfoArr.push(v.value)
                                    })
                                    console.log(tempImgInfoArr, artGalleryDeatils.artworks, '------------------')
                                    artGalleryDeatils.artworks.forEach((value, index) => {
                                        if (index % 2 == 0) {
                                            if (index == 0) {
                                                value.left = 0
                                            } else {
                                                value.left = 0
                                                console.log(imgInfoArr)
                                                tempImgInfoArr.forEach((tempvalue, tempindex) => {
                                                    if (tempindex < index) {
                                                        console.log(tempvalue)
                                                        if (tempindex % 2 == 0) {
                                                            value.left += tempvalue + 10
                                                        }
                                                    }

                                                })

                                            }
                                            value.top = 0
                                        } else {
                                            if (index == 1) {
                                                value.left = 0;
                                            } else {
                                                value.left = 0
                                                console.log(imgInfoArr)
                                                tempImgInfoArr.forEach((tempvalue1, tempindex1) => {
                                                    if (tempindex1 < index) {
                                                        if (tempindex1 % 2 !== 0) {
                                                            value.left += tempvalue1 + 10
                                                        }

                                                    }
                                                })

                                            }
                                            value.top = 290
                                        }
                                    })
                                    console.log(artGalleryDeatils)

                                    this.setData({
                                        artGalleryDeatils: artGalleryDeatils
                                    })
                                }
                            }
                        })
                    })
                }

            }
        })

    }


})
