Page({
  
  data: {
  },

  onLoad: function (options) {
    // 初次加载中获取初始收件地点信息
    this.RefreshData()
  },

  onPullDownRefresh: function () {
    this.RefreshData()
  },

  RefreshData : function(){
    //获取数据库中此open_id的收件地址信息
    const InitialSearch = wx.cloud.database()
    InitialSearch.collection('ReceivingLoc').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          RevInfos: res.data
        })
        console.log('常用收件地址查询成功: ', res)
      },
      fail: err => {
        console.error('常用收件地址查询失败：', err)
      }
    })
  },

  AddRevLoc :function(){
    wx.navigateTo({
      url: '../addrevloc/addrevloc',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})
