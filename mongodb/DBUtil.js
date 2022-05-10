const ServerUtil = require('../ServerUtil')
// MongoDB
const Chart = require('./model/Chart')
const User = require('./model/User')
const Message = require('./model/Message')

module.exports = {

  listChart (tab, yymmddhh = ServerUtil.getYymmddhh()) {
    return new Promise(function (resolve, reject) {
      try {
        Chart.find({ yymmddhh, tab }, null, { sort: { num: 1 } }, (err, result) => {
          if (err) {
            console.log('chart find error...', err)
            resolve()
          } else if (err || !result || result.length === 0) {
            // console.log(`${yymmddhh} result not exists ${tab}`)
            resolve([])
          } else {
            // console.log(`${yymmddhh} result exists ${tab}`)
            const dupCheck = []
            const list = (result || []).filter((obj) => {
              const num = obj.num
              if (!dupCheck.includes(num)) {
                dupCheck.push(num)
                return true
              } else return false
            })
            resolve(list)
          }
        })
      } catch (error) {
        console.log('chart find error...', error)
        resolve()
      }
    })
  },

  insertChartList (tab, yymmddhh = ServerUtil.getYymmddhh(), list = []) {
    const saveList = list.map((obj) => {
      return { ...obj, tab, yymmddhh }
    })
    Chart.deleteMany({ yymmddhh, tab }).then(() => { Chart.insertMany(saveList) })
  },

  updateChartVideoInfo (tab, yymmddhh, num, videoInfo) {
    Chart.findOne({ yymmddhh, tab, num }, (err, chart) => {
      if (err || !chart) {
        console.log('updateChartVideoInfo error', err)
      } else {
        chart.videoId = videoInfo.videoId
        chart.videoTime = videoInfo.videoTime
        chart.save((err) => { if (err) console.log('updateChartVideoInfo update error...', err) })
        // console.log('updateChartVideoInfo success', videoInfo)
      }
    })
  },

  findUserByIdPw (userId, userPassword) {
    return new Promise(function (resolve, reject) {
      try {
        User.find({ userId }, (err, users) => {
          if (err || !users || !users.length) resolve('NOTEXISTS')
          else if (users[0].userPassword !== userPassword) resolve('INVALID')
          else resolve(users[0])
        })
      } catch (error) {
        console.log('find user error...', error)
        resolve()
      }
    })
  },

  async findUserBy_id (userId) {
    const user = await User.findOne({ userId })
    if (!user) return undefined
    else return user._doc
  },

  joinUser (userId, userPassword) {
    return new Promise(function (resolve, reject) {
      try {
        User.find({ userId }, (err, users) => {
          if (err || (users && users.length)) resolve('EXISTS')
          else {
            User.insertMany([{
              userId, userPassword
            }])
            resolve('SUCCESS')
          }
        })
      } catch (error) {
        console.log('join user error...', error)
        resolve()
      }
    })
  },

  // userId, music
  insertMySong (param) {
    return new Promise(function (resolve, reject) {
      try {
        User.updateOne(
          { userId: param.userId },
          { music: param.music },
          (err, raw) => {
            if (!err) resolve('SUCCESS')
            else {
              console.log('update user error', err)
              resolve()
            }
          }
        )
      } catch (error) {
        console.log('update user error...', error)
        resolve()
      }
    })
  },

  async listMessage (param) {
    let list = []
    if (!param) {
      list = await Message.find({}, null, { sort: { date: -1 } })
    } else {
      const pageIndex = param.pageIndex || 1
      list = await Message.find({}, null, { sort: { date: -1 } })
        .skip((pageIndex - 1) * param.pageSize).limit(param.pageSize)
    }
    return list
  },

  insertMessage (param = {}) {
    return Message.insertMany([{
      writer: param.writer,
      contents: param.contents,
      date: ServerUtil.getCurrentFullDateStr()
    }])
  },

  insertManyMessage (param = []) {
    return Message.insertMany(param.map((obj) => {
      return {
        writer: obj.writer,
        contents: obj.contents,
        date: obj.date
      }
    }))
  }

}
