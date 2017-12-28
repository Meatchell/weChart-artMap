Page({
    data:{
        searchData:'',
        searchPlaceholder:'请输入相关作品名称或作者',
        artTypeList:[]
    },
    onLoad:function(data){
        if(data.searchData == 'undefined') return;
        if(data.searchData == '综合材料') {
            this.setData({
                searchPlaceholder:"请输入"+ data.searchData +"名称或"+ data.searchData +"品牌"
            })
            return
        }
        console.log(data)
        this.setData({
            searchPlaceholder:"请输入"+ data.searchData +"作品名称或"+ data.searchData +"作者"
        })
        wx.request({
            // url:"https://www.huangli13.cn/v1/artwork/list?page=1&artworktype="+data.searchType,
            url:"https://www.huangli13.cn/v1/artwork/list?page=1&artworktype=1",
            success:res=>{
                console.log(res.data.data)
                this.setData({
                    artTypeList:res.data.data
                })
            }
        })
        console.log(data,'搜索页')
    },
    remove:function (){
        this.setData({
            searchData:''
        })
    },
    search:function(event){
        console.log(event.detail.value)
    }
})