require('babel-polyfill')
const ServerUtil = require('../ServerUtil')
// MongoDB
const Chart = require('./model/Chart')
const User = require('./model/User')
const Message = require('./model/Message')

module.exports = {

  listChart(tab, yymmddhh=ServerUtil.getYymmddhh()) {
    return new Promise(function (resolve, reject) {

      try {
        Chart.find({yymmddhh, tab}, null, {sort: {num: 1}}, (err, result)=>{
          if(err){
            console.log('chart find error...', err)
            reject('chart find error...')

          }else if(err || !result || result.length === 0){
            console.log(`${yymmddhh} result not exists ${tab}`)
            resolve([])

          }else{

            console.log(`${yymmddhh} result exists ${tab}`)
            let dupCheck = []
            const list = (result || []).filter((obj)=>{
              const num = obj.num
              if(!dupCheck.includes(num)){
                dupCheck.push(num)
                return true
              }else return false
            })
            resolve(list)
          }
        })
      } catch (error) {
        console.log('chart find error...', error)
        reject('chart find catch error...')
      }
    })
  },

  insertChartList(tab, yymmddhh=ServerUtil.getYymmddhh(), list=[]) {
    const saveList = list.map((obj)=>{
      return {...obj, tab, yymmddhh}
    })
    Chart.remove({yymmddhh, tab}).then(()=>{Chart.insertMany(saveList)})
  },

  findUserByIdPw(userId, userPassword){
    return new Promise(function (resolve, reject) {
      try {
        User.find({ userId }, (err, users)=>{
          if(!users || !users.length) resolve('NOTEXISTS')
          else if(users[0].userPassword != userPassword) resolve('INVALID')
          else resolve(users[0])
        })
      } catch (error) {
        console.log('find user error...', error)
        reject('find user catch error...')
      }
    })
  },

  findUserBy_id(userId){
    return new Promise(function (resolve, reject) {
      try {
        User.find({ userId }, (err, users)=>{
          if(!users || !users.length) resolve('NOTEXISTS')
          else resolve(users[0])
        })
      } catch (error) {
        console.log('find user one error...', error)
        reject('find user one catch error...')
      }
    })
  },

  joinUser(userId, userPassword){
    return new Promise(function (resolve, reject) {
      try {
        User.find({ userId }, (err, users)=>{
          if(users && users.length) resolve('EXISTS')
          else{
            User.insertMany([{
              userId, userPassword
            }])
            resolve('SUCCESS')
          }
        })
      } catch (error) {
        console.log('join user error...', error)
        reject('join user catch error...')
      }
    })
  },

  // userId, music
  insertMySong(param){
    return new Promise(function (resolve, reject) {
      try {
        User.update(
          {userId: param.userId},
          {music: param.music},
          (err, raw)=>{
            if(!err) resolve('SUCCESS')
            else{
              console.log('update user error', err)
              reject('update user error')
            }
          }
        )
      } catch (error) {
        console.log('update user error...', error)
        reject('update user catch error...')
      }
    })
  },

  listMessage(param={}) {
    return new Promise(function (resolve, reject) {

      try {
        Message.find({}, null, {sort: {date: -1}}, (err, result)=>{
          if(err){
            console.log('message find error...', err)
            reject('message find error...')

          }else{
            resolve(result || [])
          }
        })
      } catch (error) {
        console.log('message find error...', error)
        reject('message find catch error...')
      }
    })
  },

  insertMessage(param={}){
    return Message.insertMany([{
      writer: param.writer,
      contents: param.contents,
      date: ServerUtil.getCurrentFullDateStr()
    }])
  }

}