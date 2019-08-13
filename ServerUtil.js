const urlencode = require('urlencode')
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment-timezone')
const timeZone = 'Asia/Seoul'

module.exports = {

  getCurrentFullDateStr () {
    return moment().tz(timeZone).format('YYYYMMDDHHmmss')
  },

  getYymmddhh () {
    return moment().tz(timeZone).format('YYYYMMDDHH')
  },

  async getChartByUrlRequest (tab, yymmddhh = this.getYymmddhh()) {
    console.log(yymmddhh, 'chart url request.. ')
    let url = ''
    switch (tab) {
      case 'top100':
        url = 'http://www.melon.com/chart/'
        break

      case 'pop':
        url = 'https://www.melon.com/genre/song_list.htm?gnrCode=GN0900'
        break

      default:
        url = 'http://www.melon.com/chart/'
        break
    }
    const list = []
    try {
      const $ = await this.urlRequest(url)
      if (!$) return

      const postElements = $('table tr td div[class^="wrap_song_info"]')
      let index = 0
      if (postElements.length > 0) {
        for (let key = 0; key < postElements.length; key++) {
          const $obj = $(postElements[key])
          const song = $obj.find('.rank01 a').text(); const singer = $obj.find('.rank02 a').eq(0).text()
          if (!song || !singer) continue

          list.push({
            num: ++index,
            yymmddhh,
            song,
            singer
          })
        }
      }
    } catch (error) {
      console.log('error', url, error)
    }

    return list
  },

  /*
    param
      - song
      - singer
  */
  async getVideoIdBySongAndSinger (param = {}) {
    if (!param.song || !param.singer) return
    const reg = new RegExp('\\(.*?\\)', 'g')
    const encodedSrchparam = urlencode(param.song.replace(reg, '') + ' ' + param.singer.replace(reg, ''))
    const url = 'https://www.youtube.com/results?search_query=' + encodedSrchparam
    console.log('getVideoIdBySongAndSinger', JSON.stringify(param), encodedSrchparam, url)
    try {
      const $ = await this.urlRequest(url)
      if (!$) return {}

      const $tag = $('.yt-lockup-video a')
      let tagLoop = 0; let href = ''; const passedId = []; let videoTime = ''
      while (tagLoop < 15) {
        const $targetTag = $tag.eq(tagLoop++)
        href = $targetTag.attr('href')
        videoTime = $targetTag.find('.video-time').html()
        if (href && href.length < 30 && href.indexOf('/watch?v=') !== -1) {
          if (!passedId.includes(href)) passedId.push(href)
          else continue

          if (videoTime) {
            const timeArr = videoTime.split(':')
            if (timeArr.length !== 2) continue // over 1hour continue
            else if (timeArr[0] >= 10) continue // over 10 minuites continue
          }
          break
        }
      }
      return { ...param, videoId: String(href || '').replace('/watch?v=', ''), videoTime }
    } catch (error) {
      console.log('error', url, error)
      return {}
    }
  },

  // param - searchInput
  async getSearchSongList (param = {}) {
    const searchUrl = 'https://www.youtube.com/results?search_query=' + urlencode(param.searchInput)
    const resultList = []
    try {
      const $ = await this.urlRequest(searchUrl)
      if (!$) return

      const $tag = $('.yt-lockup-video a')
      let tagLoop = 0; let href = ''
      const passedHref = []
      while (tagLoop < 20) {
        const $targetTag = $tag.eq(tagLoop++)
        href = $targetTag.attr('href')
        if (href && href.length < 30 && href.indexOf('/watch?v=') !== -1) {
          if (!passedHref.includes(href)) passedHref.push(href)
          else continue

          const title = $targetTag.parent().parent().find('.yt-lockup-title a').eq(0).attr('title')
          if (!title) continue
          resultList.push({
            videoId: href.replace('/watch?v=', ''),
            title: title,
            videoTime: $targetTag.find('.video-time').html()
          })
        }
      }
    } catch (error) {
      console.log('error', searchUrl, error)
    }

    return resultList
  },

  urlRequest (url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, response, body) {
        try {
          if (error || !body) {
            console.log('Unexpected Error :::')
            resolve()
          } else {
            const $ = cheerio.load(body)
            resolve($)
          }
        } catch (e) {
          console.log('request Error :::', e)
          resolve()
        }
      })
    })
  }

}
