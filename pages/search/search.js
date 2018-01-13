let pageIndex = 1
Page({
    data:{
        searchData:'',
        searchPlaceholder:'请输入相关作品名称或作者',
        artTypeList:[],
        isFocus:false, // 自动获取焦点
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
        searchType:0
    },
    onLoad:function(data){
        let that = this
        this.setData({
            searchType:data.searchType
        })
        if(data.searchType == 0) {
            that.setData({
                isFocus:true
            })

        }else {
            if(data.searchData == '综合材料') {
                this.setData({
                    searchPlaceholder:"请输入"+ data.searchData +"名称或"+ data.searchData +"品牌"
                })
            }else if(data.searchType == 'undefined'){

            } else {
                this.setData({
                    searchPlaceholder:"请输入"+ data.searchData +"作品名称或"+ data.searchData +"作者"
                })
                wx.request({
                    // url:"https://www.szartmap.com/v1/artwork/list?page=1&artworktype=",
                    url:"https://www.szartmap.com/v1/artwork/list?page="+pageIndex+"&artworktype="+data.searchType,
                    success:res=>{
                        this.setData({
                            artTypeList:res.data.data
                        })
                    }
                })
            }

        }

    },
    remove:function (){
        this.setData({
            searchData:''
        })
    },
    search:function(event){
        let that = this
        wx.request({
            url:"https://www.szartmap.com/v1/artwork/search?artworktype="+this.data.searchType+"&keyword="+event.detail.value,
            success:res=>{
                that.setData({

                    artTypeList:res.data.data
                })
            }
        })
    },
    Toback:function(){
        wx.navigateTo({
            url:'../mallHome/mallHome'
        })
    },
    ToArtWorkDeatils:function(event){
        wx.navigateTo({
          url: '../artWorkDeatils/artWorkDeatils?artGalleryId='+event.currentTarget.dataset.artgalleryid
        })
    },
    searchScrollLower:function(){
        // if(this.data.searchLoading) return  //接流阀
        this.setData({
            searchLoading:true
        })
        pageIndex++
        wx.request({
            url:"https://www.szartmap.com/v1/artwork/list?page="+pageIndex+"&artworktype="+this.data.searchType,
            success:res=>{
                if(res.data.data == 0) {
                   this.setData({
                       searchLoading:false,
                       searchLoadingComplete:true
                   })
                    return
                }
                let  data = this.data.artTypeList.concat(res.data.data)
                this.setData({
                    artTypeList: data,
                    searchLoading:false
                })
            }
        })

    },
})