// pages/editrevloc/editrevloc.js
Page({
  data: {
    reg_name: '',
    reg_phonenum: '',
    reg_address: '',
    reg_isdefault: 0,
    clickId:'',
    defaultId:''
  },

  onLoad: function (option) {
    var id = option.click_id;
    this.setData({
      clickId:id
    })
    this.PrepareInfo()
  },

  PrepareInfo: function(){
    const LocSearch = wx.cloud.database()
    LocSearch.collection('ReceivingLoc').where({
      _id: this.data.clickId
    }).get({
      success: res => {
        this.setData({
          Info: res.data,
        })
        console.log('词条地址信息查询成功: ', res)
        this.setData({
          reg_name: this.data.Info[0].name,
          reg_phonenum: this.data.Info[0].phonenum,
          reg_address: this.data.Info[0].address,
          reg_isdefault: this.data.Info[0].isdefault
        })
        //console.log(this.data.reg_name)
      },
      fail: err => {
        console.error('词条地址信息查询失败：', err)
      }
    })
  },

  UserNameInput: function (e) {
    this.setData({
      reg_name: e.detail.value
    })
  },

  UserPhoneNumInput: function (e) {
    this.setData({
      reg_phonenum: e.detail.value
    })
  },

  UserAddressInput: function (e) {
    this.setData({
      reg_address: e.detail.value
    })
  },

  SwitchChange: function () {
    var SwitchState = this.data.reg_isdefault;
    SwitchState = (SwitchState + 1) % 2;
    this.setData({
      reg_isdefault: SwitchState,
    })
  },

  SaveEdit: function () {
    this.ChangeDefault(),
    this.EditLoc()
  },

  ChangeDefault: function (e) {
    if(defaultId!=clickId)
    {
      const db = wx.cloud.database()
      db.collection('ReceivingLoc').doc(defaultId).update({
        data: {
          isdefault: 0
        }
      })
    }
  },

  EditLoc: function (e) {
    const db = wx.cloud.database()
    db.collection('ReceivingLoc').doc(clickId).update({
      data: {
        isdefault: reg_isdefault,
        name: reg_name,
        address: reg_address,
        phonenum: reg_phonenum
      },
      success: res => {
        console.log('修改地址信息成功，记录 _id: ', res._id)
        this.setData({
          reg_name: '',
          reg_phonenum: '',
          reg_address: '',
        })
      },
      fail: err => {
        console.error('修改地址信息失败：', err)
      }
    }),
      this.ReturnRev()
  },

  ReturnRev: function (e) {
    wx.navigateBack({
      delta: 1,
    })
  },

  FindDefault: function () {
    //获取数据库中此open_id的收件地址信息
    const InitialSearch = wx.cloud.database()
    InitialSearch.collection('ReceivingLoc').where({
      _openid: this.data.openid
    }).where({
      isdefault: 1
    }).get({
      success: res => {
        this.setData({
          DefaultInfo: res.data,
        })
        console.log('默认地址信息查询成功: ', res)
        if (this.data.DefaultInfo[0].isdefault == 1) {
          this.setData({
            defaultId: this.data.DefaultInfo[0]._id
          })
        }
        else {
          this.setData({
            defaultId: 0
          })
        }
      },
      fail: err => {
        console.error('默认地址信息查询失败：', err)
      }
    })
  },
})