// pages/addrevloc/addrevloc.js
Page({
  data:{
    reg_name: '',
    reg_phonenum:'',
    reg_address:'',
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

  SaveAdd: function (e) {
    const db = wx.cloud.database()
    db.collection('ReceivingLoc').add({
      data: {
        name: this.data.reg_name,
        phonenum: this.data.reg_phonenum,
        address: this.data.reg_address,
        isdefault:0 //需要更多函数
      },
      success: res => {
        console.log('新增收件地址成功，记录 _id: ', res._id)
        this.setData({
          reg_name: '',
          reg_phonenum: '',
          reg_address: '',
        })
      },
      fail: err => {
        console.error('新增收件地址失败：', err)
      }
    }),
    this.ReturnRev()
  },

  ReturnRev: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
})