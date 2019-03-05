Page({
  
  data: {
    reg_IsDefaultId:'', //默认收件地址_id（如果存在）
    hasDefault:0  //有无默认收件地址
  },

  onLoad: function (options) {
    // 初次加载中获取初始收件地点信息
    this.RefreshData(), 
    this.FindDefault()
  },

  onPullDownRefresh: function () {
    //下拉刷新，与onload中行为相同
    this.RefreshData(),
    this.FindDefault()
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

  FindDefault: function () {
    //获取数据库中此open_id的默认地址信息
    const InitialSearch = wx.cloud.database()
    InitialSearch.collection('ReceivingLoc').where({
      _openid:this.data.openid
    }).where({
      isdefault:1 //附加条件“默认地址"
    }).get({
      success: res => {
        this.setData({
          DefaultInfo: res.data,  
        })
        console.log('默认地址信息查询成功: ', res)
        if (this.data.DefaultInfo[0].isdefault==1) 
        {
          this.setData({
            hasDefault:1, //默认收件地址存在
            reg_IsDefaultId: this.data.DefaultInfo[0]._id //记录默认收件地址_id
          })
        }
        else
        {
          this.setData({
            hasDefault: 0
          })
        }
      },
      fail: err => {
        console.error('默认地址信息查询失败：', err)
      }
    })
  },

  AddRevLoc :function(){
    //跳转至添加收件地址页面
    if(this.data.hasDefault==1)
    {
      wx.navigateTo({
        url: '../addrevloc/addrevloc?DefaultExist=1&id=' + this.data.reg_IsDefaultId,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    else
    {
      wx.navigateTo({
        url: '../addrevloc/addrevloc?DefaultExist=0',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  EditRevLoc: function (e) {
    //跳转至编辑收件地址页面
    wx.navigateTo({
      url: '../editrevloc/editrevloc?click_id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})
