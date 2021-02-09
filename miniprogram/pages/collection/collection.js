// miniprogram/pages/index/collection.js
var app=getApp();
Page({
  data: {
    ColorList: [],
  },
  onLoad: function(){
    console.log("collection-onLoad")
  },
  onReady: function(){
    console.log("collection-onReady")
  },
  onShow: function () {
    console.log("collection-onShow")
    let that=this;
    wx.cloud.callFunction({
      name: "GetColor",
      data: {
      },
      success: function(res){
        that.setData({
          ColorList: res.result.data,
        })
      },
      fail: console.error
    });
  },
  colorEdit: function(e){
    app.globalData.lock=false;
    app.globalData.colorInfo=this.data.ColorList[e.currentTarget.dataset.index];
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})