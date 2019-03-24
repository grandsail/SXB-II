@@ -1, 75 + 0, 0 @@
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await db.collection('Cars').count()
  console.log(event.carNum)
  console.log(countResult.total)
  var openid = event.userInfo.openId
  var carNum = 0
  var carBox = 0
  var flag = 0
  if (countResult.total == 0) {
    const ad = await db.collection('Cars').add({
      data: {
        carNum: 1,
        now: 1,
        postnum: [event.postnum],
        openId: [openid],
        address: event.address,
        time: event.time,
        isuse: true
      }
    })
    carNum = 1
    carBox = 1
    console.log(carNum)
    console.log(carBox)
  }
  else {
    const carInfo = await db.collection('Cars').get()
    for (var i = 0; i < countResult.total; i++) {
      console.log(carInfo.data[i])
      if (event.time == carInfo.data[i].time && event.address == carInfo.data[i].address && carInfo.data[i].now < 6) {
        const update = await db.collection('Cars').doc(carInfo.data[i]._id).update
          ({
            data: {
              now: carInfo.data[i].now + 1,
              postnum: db.command.push(event.postnum),
              openId: db.command.push(openid),
            }
          })
        carNum = carInfo.data[i].carNum
        carBox = carInfo.data[i].now + 1
        flag = 1
        console.log(carNum)
        console.log(carBox)
        break;
      }
    }
    if (flag == 0) {
      const a = await db.collection('Cars').add({
        data: {
          carNum: carInfo.data[(countResult.total - 1)].carNum + 1,
          now: 1,
          postnum: [event.postnum],
          openId: [openid],
          address: event.address,
          time: event.time,
          isuse: true
        }
      })
      carNum = carInfo.data[(countResult.total - 1)].carNum + 1
      carBox = 1
      console.log(carNum)
      console.log(carBox)
    }
  }
  return {
    carBox,
    carNum
  }
}