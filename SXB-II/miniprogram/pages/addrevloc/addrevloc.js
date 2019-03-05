// pages/addrevloc/addrevloc.js
Page({
  data:{
    reg_name: '', //保存用户填写的姓名
    reg_phonenum:'',  //保存用户填写的手机号
    reg_address:'', //保存用户填写的地址
    reg_isdefault:0,  //保存用户对是否设为默认的选择
    hasDefault:0, //是否存在其他默认地址，没有为0
    reg_toChangeId:'' //其他默认地址_id
  },


  onLoad: function (option) {
    var temp = option.DefaultExist; //带参跳转，参数是否存在其他默认地址
    var id=option.id;  //带参跳转，参数为其他默认地址_id
    this.setData({
      hasDefault:temp
    })
    if(this.data.hasDefault==1)
    { //若存在其他默认地址则记录其_id
      this.setData({
        reg_toChangeId: id
      })
    }
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

  SaveAdd: function(){
    //保存新增添地址
    this.ChangeDefault(), //处理已有的默认地址
    this.AddLoc() //写入数据库
  },

  ChangeDefault: function(e){
    //处理原有默认收件地址
    if(this.data.hasDefault==1&&reg_isdefault==1)
    { //若已存在默认收件地址且要新增添收件地址则将原来的收件地址默认设为否
      const db = wx.cloud.database()
      db.collection('ReceivingLoc').doc(this.data.reg_toChangeId).update({
        data: {
          isdefault: 0
        }
      })
    }
  },

  AddLoc: function (e) {
    //写入数据库
    const db = wx.cloud.database()
    db.collection('ReceivingLoc').add({
      data: {
        name: this.data.reg_name,
        phonenum: this.data.reg_phonenum,
        address: this.data.reg_address,
        isdefault:this.data.reg_isdefault,
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