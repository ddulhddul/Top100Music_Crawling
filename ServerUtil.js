require('babel-polyfill')
// const urlencode = require('urlencode')
const request = require('request')
const cheerio = require('cheerio')

module.exports = {

  lpadNum(num){
    if(num < 10) return '0'+num
    else return String(num)
  },

  getYymmddhh(param){
    // if(typeof moment !== 'undefined'){
    //     return moment().utcOffset("+09:00").format('YYYYMMDDHH')
    // }
    let date = param || new Date();
    return date.getFullYear()+
        this.lpadNum(date.getMonth()+1)+
        this.lpadNum(date.getDate())+
        this.lpadNum(date.getHours())
  },

  async getChartByUrlRequest(tab){

    let yymmddhh = this.getYymmddhh()
    console.log(yymmddhh, 'chart url request.. ')
    let url = ''
    switch (tab) {
        case 'song':
            url = 'http://www.melon.com/chart/'
            break;

        case 'popsong':
            url = 'https://www.melon.com/genre/song_list.htm?gnrCode=GN0900'
            break;
    
        default:
            url = 'http://www.melon.com/chart/'
            break;
    }
    const $ = await this.urlRequest(url)
    if(!$) return

    let postElements = $('table tr td div[class^="wrap_song_info"]');
    let result = [];
    let index = 0;
    let reg = new RegExp('\\(.*?\\)','g')
    if(postElements.length > 0){
      for(let key = 0; key < postElements.length; key++){
        let $obj = $(postElements[key]);
        let song = $obj.find('.rank01 a').text(), singer = $obj.find('.rank02 a').eq(0).text();
        if(!song || !singer) continue;

        // let encodedSrchparam = urlencode(song.replace(reg,'')+' '+singer.replace(reg,''));
        result.push({
            num: ++index,
            song : song,
            singer : singer,
            // url : 'https://www.youtube.com/results?search_query='+encodedSrchparam,
            // videoId: '',
            srch : song.replace(reg,'')+' '+singer.replace(reg,'')
        })
      }
      
      return {
        result: result,
        yymmddhh: yymmddhh
      }
    }

  },

  urlRequest(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, response, body) {
        try {
          if (error) reject('Unexpected Error :::')
          let $ = cheerio.load(body)
          resolve($)
            
        } catch(e) {
          resolve()
          console.log('request Error :::', e)
        }
      })
    })
  },

}