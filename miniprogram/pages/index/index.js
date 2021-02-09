//index.js
var app=getApp();
Page({
  data: {
  },
  createColor: function(){
    var color=[]
    for(let i=0;i<4;++i){
      color.push(
        '#'+
        (Math.floor(Math.random()* 128)+127).toString(16)+
        (Math.floor(Math.random()* 128)+127).toString(16)+
        (Math.floor(Math.random()* 128)+127).toString(16)
      );
    }
    this.setData({
      markIconType: "outline",
      color:color,
      shiftIndex:NaN,
      R:0,
      G:0,
      B:0
    })
  },
  onLoad:function(e){
    console.log("index-onLoad")
  },
  onReady: function(){
    console.log("index-onReady")
  },
  onShow: function () {
    console.log("index-onShow")
    if (app.globalData.lock==false) {
      this.setData({
        markIconType: "field",
        color: app.globalData.colorInfo.color,
        tempID: app.globalData.colorInfo._id,
        R:0,
        G:0,
        B:0
      });
      app.globalData.lock=true;
      app.globalData.colorInfo={};
    }else{
      this.createColor();
    }
  },
  selectColor:function(e){
    let index=parseInt(e.currentTarget.dataset.index)
    let selectedColor=this.data.color[index];
    this.setData({
      shiftIndex:index,
      R: parseInt("0x"+selectedColor.substring(1,3)),
      G: parseInt("0x"+selectedColor.substring(3,5)),
      B: parseInt("0x"+selectedColor.substring(5,7))
    })
  },
  shiftColor:function(e){
    let color=e.currentTarget.dataset.color;
    let value=e.detail.value;
    this.setData({
      [color]:value,
    })
    let newColor=this.data.color;
    newColor[this.data.shiftIndex]="#"+this.data.R.toString(16)+this.data.G.toString(16)+this.data.B.toString(16);
    this.setData({
      color:newColor,
      markIconType: "outline",
    })
  },
  markThis:function(){
    let type,message;
    let that=this;
    if(this.data.markIconType=="outline"){
      type="field";
      message="收藏成功";
      wx.cloud.callFunction({
        name: 'AddColor',
        data: {
          color: this.data.color
        },
        success: function (res) {
          console.log(res)
          console.log("Add Color Success: ", res.result._id);
          that.setData({
            tempID: res.result._id
          })
        },
        fail: console.error
      });
    }else{
      console.log(this.data.tempID);
      type="outline";
      message="取消收藏";
      wx.cloud.callFunction({
        name: 'DeleteColor',
        data:{
          _id: this.data.tempID
        },
        success: console.log("Delete Color Success: ", this.data.tempID),
        fail: console.error
      })
    }
    wx.showToast({
      title: message,
      icon: "success"
    })
    this.setData({
      markIconType:type
    })
  }
})
