// miniprogram/pages/test/test.js
Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.data.id=options.id;
    this.onQuery()
  },

  data: {
    focus: false,
    inputValue: '',
    queryResult: '',
    count: 0,
    id:'',
  },
  //查找
  onQuery: function () {
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('Orders').where({
      _id: this.data.id
    }).get({
      success: res => {
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //更改
   onUpdate: function (e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    wx.navigateTo({
      url: '../change/change?id=' + this.data.id+'&date='+this.data.queryResult[0].date+'&time='+this.data.queryResult[0].time+'&postnum='+this.data.queryResult[0].postnum  })
  },
  //删除
  onRemove: function (e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    db.collection('Orders').doc(this.data.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.setData({
          counterId: '',
          count: null,
        })
        wx.navigateTo({
          url: '../frontpage/frontpage',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
})