let authorText
let myAuthorText
let introductionText
let myIntroductionText

Page({
    data: {
        showModal: false,
        introductionLongStr:true,
        authorLongStr: true,
        authorText: '',
        introductionText: '',
        imgSrc:'',
        showImg:[], //预览图片
        name:'',
        authorLongStr:false,
        introductionLongStr:false,
        price:'',
        deatils:'',
        phoneNumber:''

    },
    onLoad: function (data) {
        let that = this
        wx.request({
            url:"https://www.szartmap.com/v1/artwork?artwork_id="+data.artGalleryId,
            success:res=>{
                let myData = res.data.data;
                authorText = myData.authorinfo
                introductionText = myData.describe
                if(myData.authorinfo.length>20){
                    myAuthorText = myData.authorinfo.slice(0,20)
                }else {
                    that.setData({
                        authorLongStr:true
                    })
                    myAuthorText = myData.authorinfo
                }
                if(myData.describe.length>20){
                    myIntroductionText = myData.describe.slice(0,20)
                }else {
                    that.setData({
                        introductionLongStr:true
                    })
                    myIntroductionText = myData.describe
                }
                that.setData({
                    name:myData.name,
                    subtitle:myData.subtitle,
                    authorText:myAuthorText,
                    introductionText:myIntroductionText,
                    price:myData.price,
                    phoneNumber:myData.phoneNum,
                    imgSrc:myData.coverimg,
                    showImg:myData.imagenames
                })

            }
        })


    },
    showModal: function (e) {


        if( !this.data.introductionLongStr && e.target.dataset.target == 'author'){
            this.setData({
                deatils:authorText,
                showModal: true
            })
        }else if(!this.data.authorLongStr) {
            this.setData({
                deatils:introductionText,
                showModal: true
            })
        }
    },
    modalHidden: function(e){

        this.setData({
            showModal:false
        })
    },
    calling:function(){
        if(this.data.phoneNumber == 'null'){
            wx.showToast({
                title:'暂无联系方式'
            })
            return
        }

        wx.makePhoneCall({
            phoneNumber: this.data.phoneNumber, //此号码并非真实电话号码，仅用于测试
            success:function(){
                console.log("拨打电话成功！")
            },
            fail:function(){
                console.log("拨打电话失败！")
            }
        })
    },
    showImg:function(){
        let imgSrcArr = []
        this.data.showImg.forEach((v,i) => {
            imgSrcArr.push(v.imagename)
        })
        let tempArr = imgSrcArr.map(v => "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+v)

        // if(tempArr.length == 0){
        //     tempArr = ["https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+this.data.imgSrc]
        // }

        wx.previewImage({
            current: "https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+this.data.imgSrc, // 当前显示图片的http链接
            // urls: tempArr // 需要预览的图片http链接列表
            urls: ["https://artmap-img.oss-cn-shenzhen.aliyuncs.com/"+this.data.imgSrc, ...[tempArr]] // 需要预览的图片http链接列表
        })
    },
   buy:function(){
        wx.showToast({
          title: '该地区暂不支持此功能,可拨打右上角电话联系商家'
        })
   }

})