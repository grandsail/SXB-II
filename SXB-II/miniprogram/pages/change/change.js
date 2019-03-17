var app = getApp()
Page({
  data:
  {
    date: '2018-09-01',
    time: '12:00',
    num: '',
    phonenum: '',
    name: '',
    address: '',
    state: 2,
    car: '',
    box: '',
    back: '',
    canUseAddr: '',
    IsAdd: 0,
    IsEdit: 0,
    select: false,
    clickId: 0,
    reg_name: '',
    reg_phonenum: '',
    reg_address: '',
    reg_id: ''
  },
  onPullDownRefresh: function () {
    //下拉刷新订单
    this.refreshData()
    wx.stopPullDownRefresh()
  },

  onLoad: function (options) {
    this.refreshData()
    this.data.id = options.id
    this.onQuery()
    this.setData({
      date: options.date,
      time: options.time,
      postnum:options.postnum
    })
  },
  //picker选择时间日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  //是否选择地址判断
  addrSelect: function (res) {
    var select = this.data.boolean;
    this.setData({
      select: !select
    })
    console.log(res)
    this.setData({
      clickId: res.currentTarget.id
    })
  },
  //刷新数据，访问数据库，寻找与本机_openid相同的收件地点记录，存储在canUseAddr数组内
  refreshData: function () {
    const db = wx.cloud.database()
    db.collection('ReceivingLoc').where({
      _openid: this.data.openid
    }).
      get({
        success: res => {
          this.setData({
            canUseAddr: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },
  //获取输入的单号数据
  userNumInput: function (e) {
    this.setData({
      userNum: e.detail.value
    })
  },
  //提交订单并跳转到首页


  //提交订单并跳转到首页
  toFrontpage: function () {
    wx.navigateTo({
      url: '../frontpage/frontpage',
    })
  },
  comfirm: function (e) {
    const db = wx.cloud.database()//打开数据库连接
    let data = e.detail.value
    this.update(db, data)  //修改记录
  }, update: function (db, data) {
    db.collection("Orders").doc(this.data.id).update({
      data: {
        date: this.data.date,
        time: this.data.time,
        postnum: this.data.userNum,
        car: this.data.back.carNum,
        box: this.data.back.carBox,
        state: 1,
        name: this.data.canUseAddr[this.data.clickId].name,
        address: this.data.canUseAddr[this.data.clickId].address,
        phonenum: this.data.canUseAddr[this.data.clickId].phonenum
      }, success: res => {
        wx.switchTab({
          url: '../frontpage/frontpage',
        })
        wx.showToast({
          title: '修改记录成功',
        })
        
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  }
  , onQuery: function () {
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
  //保存编辑
  saveEdit: function (e) {
    const db = wx.cloud.database()
    db.collection('recievingloc').doc(this.data.reg_id).remove({})
    db.collection('recievingloc').add({
      data: {
        name: this.data.reg_name,
        phonenum: this.data.reg_phonenum,
        address: this.data.reg_address
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        this.setData({
          reg_name: '',
          reg_phonenum: '',
          reg_address: '',
          reg_id: '',
        })
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    this.setData({
      IsEdit: 1,
      IsAdd: 0
    })
  },
  //取消编辑
  cancel() {
    this.setData({
      IsAdd: 0,
      IsEdit: 0,
    })
  },
  //跳转至更多
  toReceivingLoc: function () {
    wx.navigateTo({
      url: '../receivingloc/receivingloc',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //编辑常用收件地址
  editAddr(e) {
    const db = wx.cloud.database()
    //db.collection('recievingloc').doc(id).remove({
    // success: res => {
    this.setData({
      reg_name: this.data.canUseAddr[this.data.clickId].name,
      reg_address: this.data.canUseAddr[this.data.clickId].address,
      reg_phonenum: this.data.canUseAddr[this.data.clickId].phonenum,
      reg_id: this.data.canUseAddr[this.data.clickId].id
    })
    var a = this.data.IsAdd;
    a = (a + 1) % 2;

    this.setData({
      IsEdit: a
    })
  }
})
