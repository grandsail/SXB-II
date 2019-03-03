Page({
  
  data: {
  },

  onLoad: function (options) {
    // 获取初始收件地点信息
    this.RefreshData()
  },

  RefreshData : function(){
    const InitialSearch = wx.cloud.database()
    InitialSearch.collection('ReceivingLoc').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          RevInfos: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})
