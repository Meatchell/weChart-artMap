const app = getApp()
let viewArr = [];
let describe ='';
let myDescribe = ''
Page({
    data: {
        artgallery: [],
        imageName:'',
        name:'',
        englishName:'',
        describe:'',
        address:'',
        openTime:'',
        closetime:'',
        transportationBus:'',
        transportationSubway:'',
        artGalleryDeatils: {},
        toView:'',
        phoneNum:'',
        showClostTime:true,  //是否显示闭馆标签
        exhibitiontheme:'',
        exhibitionttime:'',
        exhibitiontcurator:'',
        exhibitioner:'',
        exhibitiontheme:'',
        showTheme:false, //是否显示展览信息
        showMore:true, //是否显示更多
        showPoint:false, //省略号
        showMoreImg:'../../imgs/6_17.png'
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function (data) {
        viewArr = []
        wx.request({
            url: "https://www.szartmap.com/v1/artgallery/info?artGallery_id="+data.artMuseumId,
            success: res => {
                let artGalleryDeatils = res.data.data
                let imgInfoArr = []
                let myCloseTime =''
                let myShowTheme =''
                let showMore =''
                let showPoint =''
                describe = artGalleryDeatils.describe
                if( artGalleryDeatils.closetime == 'null'){
                    myCloseTime = false
                }else {
                    myCloseTime = true
                }
                if( artGalleryDeatils.exhibitiontheme == 'null' || artGalleryDeatils.exhibitiontheme ==  null){
                    myShowTheme = false
                }else {
                    myShowTheme = true
                }
                if( artGalleryDeatils.describe.length > 130){
                    showMore = true
                    showPoint = false
                    myDescribe = artGalleryDeatils.describe.slice(0,129)
                }else {
                    showMore = false
                    showPoint = true
                    myDescribe = artGalleryDeatils.describe
                }
                this.setData({
                    imageName:artGalleryDeatils.imageName,
                    name:artGalleryDeatils.name,
                    englishName:artGalleryDeatils.englishName,
                    address:artGalleryDeatils.address,
                    describe:myDescribe,
                    showPoint:showPoint,
                    openTime:artGalleryDeatils.openTime,
                    closetime:artGalleryDeatils.closetime,
                    showCloseTime:myCloseTime,
                    transportationBus:artGalleryDeatils.transportationBus,
                    transportationSubway:artGalleryDeatils.transportationSubway,
                    phoneNum:artGalleryDeatils.phoneNum,
                    showTheme:myShowTheme,
                    exhibitiontheme:artGalleryDeatils.exhibitiontheme,
                    exhibitionttime:artGalleryDeatils.exhibitionttime,
                    exhibitiontcurator:artGalleryDeatils.exhibitiontcurator,
                    exhibitioner:artGalleryDeatils.exhibitioner,
                    exhibitioninfo:artGalleryDeatils.exhibitioninfo,
                    showMore:showMore,

                })
                if (artGalleryDeatils.artworks instanceof Array) {
                    res.data.data.artworks.forEach((v, i) => {
                        v.view = v.coverimg
                        viewArr.push(v.coverimg)
                        v.coverimgInfo = "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/" + v.coverimg
                        v.coverimg = "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/" + v.coverimg+'?x-oss-process=image/resize,m_lfit,h_200'
                        wx.request({
                            url: v.coverimgInfo + "?x-oss-process=image/info",
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
                                    let tempImgInfoArr = []
                                    imgInfoArr.forEach(function (v, i) {
                                        tempImgInfoArr.push(v.value)
                                    })
                                    artGalleryDeatils.artworks.forEach((value, index) => {
                                        if (index % 2 == 0) {
                                            if (index == 0) {
                                                value.left = 0
                                            } else {
                                                value.left = 0
                                                tempImgInfoArr.forEach((tempvalue, tempindex) => {
                                                    if (tempindex < index) {
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

    },
    // 锚点设置
    scrollToViewFn: function (e) {
        let _id = e.currentTarget.dataset.myid;
        this.setData({
            toView:  _id
        })
    },
    calling:function(){
        if(this.data.phoneNumber == null || this.data.phoneNumber == null){
            wx.showToast({
              title: '暂无联系电话'
            })
            return
        }
        wx.makePhoneCall({
            phoneNumber: this.data.phoneNum, //此号码并非真实电话号码，仅用于测试
            success:function(){
                console.log("拨打电话成功！")
            },
            fail:function(){
                console.log("拨打电话失败！")
            }
        })
    },
    showView:function(e){
        let tempArr = viewArr.map(v => "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+v)
        wx.previewImage({
            current: "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+e.currentTarget.dataset.mysrc, // 当前显示图片的http链接
            urls: tempArr // 需要预览的图片http链接列表
        })
    },
    showMore:function(){
        if(this.data.describe.length == 129){
            this.setData({
                describe:describe,
                showPoint:true,
                showMoreImg:'../../imgs/noMore1.png'
            })
        }else{
            this.setData({
                describe:myDescribe,
                showPoint:false,
                showMoreImg:'../../imgs/6_17.png'
            })
        }
    }

})
