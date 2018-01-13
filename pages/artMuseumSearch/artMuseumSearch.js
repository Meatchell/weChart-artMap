const app = getApp()

Page({
    data: {
        data: false,
        isFocus:true,
        searchData:[]
    },
    onLoad: function (data) {
        
    },
    ToArtDeatils:function(e){
        wx.navigateTo({
          url: '../artMuseumDeatils/artMuseumDeatils?artMuseumId='+e.currentTarget.dataset.artmuseumid
        })
    },
    backMap:function(e){

        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];  //当前页面
        let prevPage = pages[pages.length - 2]; //上一个页面
        // console.log(e.currentTarget.dataset.longitude);
        let curPageBackups = app.globalData.backups
        console.log(app.globalData.backups, e.currentTarget.dataset.artmuseumid);
        curPageBackups.forEach((v,i) => {
            if(v.id == e.currentTarget.dataset.artmuseumid){
                v.callout.display = 'ALWAYS'
            }
        })
        prevPage.setData({
            latitude:e.currentTarget.dataset.latitude,
            longitude:e.currentTarget.dataset.longitude,
            scale:16,
            backMuseumId:e.currentTarget.dataset.artmuseumid,
            mapClick:true,
            myMarkers: curPageBackups
        })

        wx.navigateBack();
        // wx.navigateTo({
        //   url: '../index/index?artMuseumId='+e.currentTarget.dataset.artmuseumid
        // })
    },
    mysearch:function(event){
        wx.request({
            url:"https://www.szartmap.com/v1/artgallery/search?keyword="+event.detail.value,
            success:res=>{
                this.setData({
                    searchData:res.data.data
                })
            }
        })
    }
})