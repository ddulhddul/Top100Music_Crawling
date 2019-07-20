require('babel-polyfill')
const ServerUtil = require('../ServerUtil')
// MongoDB
const Chart = require('./model/Chart')

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
  }

}