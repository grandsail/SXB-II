var app = getApp();
Page({
onLoad: function (options) {
    this.setData({
      a: app.globalData.adc,
    })
  },
data:
{
  a: app.globalData.adc
},

//点击头像跳转至userinfo页面
changeToUserinfo: function () {
  wx.navigateTo({
    url: '../userinfo/userinfo'
  })
},

//点击“常用收件地点”跳转至receivingloc页面
changeToReceivingloc: function() {
  app.globalData.adc = 2
  console.log(app.globalData.adc)
  
  wx.navigateTo({
    url: '../receivingloc/receivingloc'
  })
},
//点击“预约记录”跳转至history页面
changeTohistory: function () {
  wx.navigateTo({
    url: '../history/history'
  })
}
})