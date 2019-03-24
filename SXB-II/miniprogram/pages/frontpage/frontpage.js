// miniprogram/pages/frontpage/frontpage.js
var app = getApp();
Page({
  onLoad: function (options) {
    // 获取初始订单信息
    this.refreshData()
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
    //下拉刷新订单
    this.refreshData()
    this.setData({
      a: app.globalData.adc,
    })
    wx.stopPullDownRefresh()
    
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  data: {
    step: 1,//换页面指示 1：我的快件 2：个人中心
    counterId: '',
    openid: '',
    count: null,
    queryResult: app.globalData.order,
    a: app.globalData.adc,
  },

  //刷新数据，访问数据库，寻找与本机_openid相同的订单，存储在queryResult数组内
  refreshData: function () {
    const db = wx.cloud.database()
    db.collection('Orders').where({
      _openid: this.data.openid

    })
      .get({
        success: res => {
          this.setData({
            queryResult: res.data,

          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    
  },

  //按加号跳转至book页面
  changeToIndex: function () {
    wx.navigateTo({
      url: '../book/book'
    })
  },



  changeToCenter: function () {
    wx.navigateTo({
      url: '../center/center'
    })
  },

  deleteclass: function (e) {
    var id = e.currentTarget.dataset.id


    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {

          const db = wx.cloud.database()
          db.collection('orders').doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
              })
              this.setData({
                counterId: '',
                count: null,
              })
              this.onLoad()
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库] [删除记录] 失败：', err)
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }

      }

    })
  }, onUpdate: function (e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    wx.navigateTo({
      url: '../gg/gg?id=' + id,
    })
  }
})
