//index.js
//获取应用实例
const app = getApp()
let backups = []   //全局变量不会随页面加载重新定义
Page({
    data: {
        artgallery: [],
        myMarkers: [],
        userInfo: {},
        latitude: '22.608306073657854',
        longitude: '114.03053283691406',
        scale: 16,
        controls: '',
        incloude:[],
        backMuseumId:'',
        mapClick:false
    },
    controltap(e) {
        let that = this
        if (e.controlId == 1) {
            wx.navigateTo({
                url: '../mallHome/mallHome'
            })
        } else if (e.controlId == 4) {  //刷新
            console.log(e.controlId)

            this.setData({
                myMarkers: [],
            })
            this.setData({
                myMarkers: backups

            })
        } else if (e.controlId == 3) {  //当前位置
            console.log(e.controlId)
            wx.getLocation({
                type: 'gcj02',
                success: function (data) {
                    that.setData({
                        longitude: data.longitude,
                        latitude: data.latitude,
                        scale: 14,
                    })
                }
            })
        }
        else {
            wx.navigateTo({
                url: '../artMuseumSearch/artMuseumSearch'
            })
        }
    },
    // bindViewTap: function () {
    //     wx.navigateTo({
    //         url: '../logs/logs'
    //     })
    // },
    onLoad: function (data) {
        let that = this;
        wx.request({
            url: "https://www.szartmap.com/v1/artgallery",
            success: res => {
                let artGallery = res.data.data
                let myMarkers = this.data.myMarkers
                artGallery.forEach((v, i) => {
                    let markObj = {}
                    if (v.type == 1) {
                        markObj.iconPath = '../../imgs/C_M.png';
                    } else if (v.type == 2) {
                        markObj.iconPath = '../../imgs/C_G.png';

                    } else if (v.type == 3) {
                        markObj.iconPath = '../../imgs/C_C.png';
                    }
                    markObj.width = 28;
                    markObj.height = 32;
                    if (v.englishName == 'null') {
                        v.englishName = ' '
                    }
                    let markName1 = v.name + "\n" + v.englishName
                    markObj.callout = {
                        fontSize: 14,
                        color: '#ffffff',
                        content: markName1,
                        bgColor: '#6c6c6c',
                        borderRadius: 10,
                        padding: 4,
                        display: 'BYCLICK',
                    }
                    markObj.type = v.type
                    markObj.longitude = v.logittude
                    markObj.latitude = v.latitude
                    markObj.id = v.artGallery_id
                    myMarkers.push(markObj)
                })

                backups = myMarkers.concat()
                this.setData({
                    myMarkers: myMarkers,
                })
                ////////////////////////////回调部分开始 否则backup获取不到数据////////////////////////////////////
                //获取我的位置
                let refresh = 0;
                let refreshFun = function(){
                    wx.getLocation({
                        type: 'gcj02',
                        success: function (data) {
                            console.log(data.longitude,data.latitude)
                            let distanceArr = []
                            console.log(backups)
                            backups.forEach((v,i) => {
                                // 距离计算
                                let radLat1 = data.latitude * Math.PI / 180.0;
                                let radLat2 = v.latitude * Math.PI / 180.0;
                                let a = radLat1 - radLat2;
                                let b = data.longitude * Math.PI / 180.0 - v.longitude * Math.PI / 180.0;
                                let s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b / 2), 2)));
                                s = s*6378.137;
                                s = Math.round(s * 10000) / 10000;
                                s = s.toFixed(5)//得出距离 截取小数位
                                distanceArr.push({id:v.id,distance:Number(s),latitude:v.latitude,longitude:v.longitude})
                            })

                            // 距离对象排序
                            let compare = function (obj1, obj2) {
                                var val1 = obj1.distance;
                                var val2 = obj2.distance;
                                if (val1 < val2) {
                                    return -1;
                                } else if (val1 > val2) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                            distanceArr.sort(compare)
                            let distanceArrFor = distanceArr.slice(0,5)
                            let mock = Math.random()
                            backups.forEach((v,i) => {
                                distanceArrFor.forEach((value,index) => {
                                    if(v.id == value.id){
                                        console.log(i)
                                        v.callout.display = 'ALWAYS'
                                        v.mock = mock
                                        console.log(mock)
                                    }else if(!(v.mock == mock)) {
                                        v.callout.display = 'BYCLICK'
                                    }
                                })
                            })
                            app.globalData.backups = backups  //用于博物馆搜索页
                            distanceArrFor.forEach((v,i) => {
                                delete  v.distance
                                delete  v.id
                            })
                            if(refresh == 0) {
                                that.setData({
                                    incloude:distanceArrFor,
                                    myMarkers:backups

                                })
                            }else {
                                that.setData({
                                    myMarkers:backups
                                })
                            }

                            refresh++
                        }
                    })
                }
                refreshFun()
                setInterval(refreshFun,1000*60)

                ////////////////////////////回调部分结束////////////////////////////////////

            }
        })

        // 根据屏幕大小适配商城入口和艺术馆搜索框位置
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    controls: [
                        {
                            id: 1,
                            iconPath: '../../imgs/mall-entrance.png',
                            position: {
                                left: res.windowWidth / 2 - 60,
                                top: res.windowHeight - 120 - 30,  //windowHeight包括小程序头部高度
                                width: 120,
                                height: 120
                            },
                            clickable: true
                        },
                        {
                            id: 2,
                            iconPath: '../../imgs/seaechInput.jpg',
                            position: {
                                top: 10,
                                left: res.windowWidth / 2 - 157,
                                width: 315,
                                height: 32
                            },
                            clickable: true
                        },
                        {
                            id: 3,
                            iconPath: '../../imgs/1_28.png',
                            top: 60,
                            position: {
                                top: res.windowHeight - 120,
                                left: 40,
                                width: 65,
                                height: 66
                            },
                            clickable: true
                        },
                        {
                            id: 4,
                            iconPath: '../../imgs/1_31.png',
                            position: {
                                top: res.windowHeight - 120,
                                left: res.windowWidth - 105,
                                width: 65,
                                height: 66
                            },
                            clickable: true
                        },
                    ]
                })
            }
        })
    },

    // marker上的气泡点击事件
    calloutap: function (e) {
        if (e.markerId == 45210075) return
        wx.navigateTo({
            url: '../artMuseumDeatils/artMuseumDeatils?artMuseumId=' + e.markerId
        })
    },
    // 地图点击事件

    mapClick: function(e) {
        console.log(this.data.mapClick)
        if(this.data.mapClick) {
           backups.forEach((v,i) => {
               if(v.id == this.data.backMuseumId){
                   v.callout.display = 'BYCLICK'
               }
           })
            this.setData({
                mapClick:false,
                myMarkers:backups
            })
        }
    }
})


