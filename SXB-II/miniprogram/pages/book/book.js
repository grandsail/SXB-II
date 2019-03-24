var app = getApp()
Page({

  data:
  {
    date: '2018-09-01',
    time: '12:00',
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
    clickId: 0,
    reg_name: '',
    reg_phonenum: '',
    reg_address: '',
    reg_id: '',
    more: 0,
    select: 1
  },


  onPullDownRefresh: function () {
    //下拉刷新，与onload中行为相同
    this.RefreshData(),
      this.FindDefault()
  },
  onLoad: function (options) {
    // 获取初始订单信息
    this.refreshData()
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



//输入收件地址
  userNameInput: function (e) {
    //获取用户填入的姓名
    this.setData({
      reg_name: e.detail.value
    })
  },

  userPhoneNumInput: function (e) {
    //获取用户填入的手机号
    this.setData({
      reg_phonenum: e.detail.value
    })
  },

  userAddressInput: function (e) {
    //获取用户填入的地址
    this.setData({
      reg_address: e.detail.value
    })
  },

  //是否选择地址判断,只要more=1时select=0,bug clickID和获取数据库信息的先后顺序
  addrSelect: function (res) {

    var d = this.data.select;
    d = (d + 1) % 2;
    var b = this.data.more;
    b = (b + 1) % 2;
     this.setData({
      select: d,
      more: b
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
  confirmSub: function (e) {

    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: "distributeCar",
      data: {
        time: this.data.time,
        postnum: this.data.userNum,
        address: this.data.canUseAddr[this.data.clickId].address,
      },
      success: res => {
        this.setData({
          back: res.result,
        })
        console.log('调用云函数成功: ', res)
        db.collection('Orders').add({
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
          },
          success: res => {
            this.setData({
              counterId: res._id,

            })
            wx.showToast({
              title: '预约成功',
            })
            wx.switchTab({
              url: '../frontpage/frontpage',
            })



            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '预约失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }

        })


      },
      fail: err => {
        console.error('调用云函数失败：', err)
      }
    })

  },

  //编辑常用收件地址
  editAddr(e) {
    var a = this.data.IsEdit;
    a = (a + 1) % 2;

    this.setData({
      IsEdit: a
    })
    const db = wx.cloud.database()
    this.setData({
      reg_id: e.currentTarget.dataset.id
    })
    //查询用户点击条目的信息
    const LocSearch = wx.cloud.database()
    LocSearch.collection('ReceivingLoc').where({
      _id: this.data.reg_id
    }).get({
      success: res => {
        this.setData({
          Info: res.data,
        })
        console.log('词条地址信息查询成功: ', res)
        if (this.data.canUseAddr !== ''){
          this.setData({
            //记录查询结果，供placeholder使用
            reg_name: this.data.Info[0].name,
            reg_phonenum: this.data.Info[0].phonenum,
            reg_address: this.data.Info[0].address,
          })
        }
        //console.log(this.data.reg_name)
      },
      fail: err => {
        console.error('词条地址信息查询失败：', err)
      }
    })
  },
  //保存编辑
  saveEdit: function (e) {
  this.setData({
   reg_id: this.data.canUseAddr[this.data.clickId]._id
   })
    const db = wx.cloud.database()
    db.collection('ReceivingLoc').doc(this.data.reg_id).remove({
    })
    db.collection('ReceivingLoc').add({
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
      IsEdit: 0,
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
  moreRecLoc: function () {
    var b = this.data.more;
    b = (b + 1) % 2;

    this.setData({
      more: b
    })
    var d = this.data.select;
    d = (d + 1) % 2;
    this.setData({
      select: d
    })
  },
//新增收件地址
  addAddr(e) {
     var a = this.data.IsAdd;
    a = (a + 1) % 2;
    this.setData({
      IsAdd: a
    })
  }
  ,
//保存新增地址
  saveAdd: function (e) {
    const db = wx.cloud.database()
    this.setData({
      name: this.data.reg_name,
      phonenum: this.data.reg_phonenum,
      address: this.data.reg_address
    })
    db.collection('ReceivingLoc').add({
      data: {
        name: this.data.name,
        phonenum: this.data.phonenum,
        address: this.data.address
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
    var a = this.data.IsAdd;
    a = (a + 1) % 2;
    this.setData({
      IsAdd: a
    })
  }

})