// pages/editrevloc/editrevloc.js
Page({
  data: {
    reg_name: '', //保存用户填写的姓名
    reg_phonenum:'',  //保存用户填写的手机号
    reg_address:'', //保存用户填写的地址
    reg_isdefault:0,  //保存用户对是否设为默认的选择
    clickId:'', //用户点击的收件地址条目的_id
    defaultId:''  //已有默认收件地址条目的_id
  },

  onLoad: function (option) {
    var id = option.click_id;
    this.setData({
      clickId:id  //记录带参跳转的参数，该参数为用户点击的收件地址条目的_id
    })
    this.PrepareInfo()  //查询该id的信息
    this.FindDefault()  //获取defaultId
  },

  PrepareInfo: function(){
    //查询用户点击条目的信息
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
          //记录查询结果，供placeholder使用
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
    //获取用户填入的姓名
    this.setData({
      reg_name: e.detail.value
    })
  },

  UserPhoneNumInput: function (e) {
    //获取用户填入的手机号
    this.setData({
      reg_phonenum: e.detail.value
    })
  },

  UserAddressInput: function (e) {
    //获取用户填入的地址
    this.setData({
      reg_address: e.detail.value
    })
  },

  SwitchChange : function(){
    //监听用户对是否设为默认地址的选择
    var SwitchState=this.data.reg_isdefault;
    SwitchState = (SwitchState + 1) % 2;
    this.setData({
      reg_isdefault : SwitchState,
    })
  },

  SaveEdit: function () {
    this.ChangeDefault(), //处理已有默认收件地址
    this.EditLoc()  //根据用户输入信息修改数据库中条目
  },

  ChangeDefault: function (e) {
    //处理已有默认收件地址
    if ((this.data.defaultId != this.data.clickId)&&(this.data.reg_isdefault==1))
    {
      console.log(this.data.defaultId)
      const db = wx.cloud.database()
      db.collection('ReceivingLoc').doc(this.data.defaultId).update({
        data: {
          isdefault: 0
        }
      })
    }
  },

  EditLoc: function (e) {
    //根据用户输入信息修改数据库中条目
    const db = wx.cloud.database()
    db.collection('ReceivingLoc').doc(this.data.clickId).update({
      data: {
        //修改数据库中特定条目的信息
        isdefault: this.data.reg_isdefault,
        name: this.data.reg_name,
        address: this.data.reg_address,
        phonenum: this.data.reg_phonenum
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
    //获取数据库中此open_id的默认收件地址信息
    const InitialSearch = wx.cloud.database()
    InitialSearch.collection('ReceivingLoc').where({
      _openid: this.data.openid
    }).where({
      isdefault: 1  //附加”是默认地址"的条件
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