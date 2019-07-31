<template>
  <div class="wrap-all">
    <div class="contents">

      <!-- Date -->
      <div class="wrap-date">
        <small>{{ yymmddhh.replace(/(.{4})(.{2})(.{2})(.{2})/, '$2.$3') }}</small>
        <small>{{ yymmddhh.replace(/(.{4})(.{2})(.{2})(.{2})/, '$4:00') }}</small>
      </div>    

      <!-- Title -->
      <div class="wrap-title" @click="setVideoTitleAndPlay()">
        <h4>
          <strong>{{ currentMusic.song }}</strong>
          <span style="white-space: nowrap;"><small>{{ currentMusic.singer }}</small></span>
          <small v-if="currentMusic.videoTime">({{ currentMusic.videoTime }})</small>
        </h4>
      </div>

      <!-- Youtube -->
      <div class="wrap-youtube" :style='{display: videoHidden? "none": "block"}'>
        <div id="player"></div>
      </div>

      <!-- Play Buttons -->
      <div class="wrap-buttons">
        <div class="btn-group">
          <button type="button" @click="playType='1'" class="btn btn-sm" :class="{'btn-info': playType=='1', 'btn-light': playType!='1'}">한곡</button>
          <button type="button" @click="playType='s'" class="btn btn-sm" :class="{'btn-info': playType=='s', 'btn-light': playType!='s'}">순차</button>
          <button type="button" @click="playType='r'" class="btn btn-sm" :class="{'btn-info': playType=='r', 'btn-light': playType!='r'}">랜덤</button>
        </div>
        &nbsp;
        <div class="btn-group">
          <button type="button" @click="pauseYoutube()" class="btn btn-sm btn-warning">일시정지</button>
          <button type="button" @click="playYoutube()" class="btn btn-sm btn-primary">재생</button>
          <button type="button" @click="nextSong()" class="btn btn-sm btn-danger">다음</button>
        </div>
        &nbsp;
        <button class="btn btn-sm" :class="{'btn-success': videoHidden, 'btn-secondary': !videoHidden}" @click='videoHidden=!videoHidden'>
          {{ !videoHidden? '숨김': '표시' }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="wrap-tabs">
        <b-tabs content-class="mt-3">
          <b-tab title="Top100" :class="{active: tab=='top100'}" @click="changeTab('top100')">
            <Music-List :musicList="musicList" @changeMusic="changeMusic" refName="top100" />
          </b-tab>
          <b-tab title="Pop" :class="{active: tab=='pop'}" @click="changeTab('pop')">
            <Music-List :musicList="musicList" @changeMusic="changeMusic" refName="pop" />
          </b-tab>
          <b-tab title="Messages" :class="{active: tab=='message'}" @click="changeTab('message')">
            <Message :initMessageInfo="initMessageInfo" :tab="tab" />
          </b-tab>
          <b-tab title="My Songs" :class="{active: tab=='mysong'}" @click="changeTab('mysong')">
            <My-Song :musicList="musicList" @changeMusic="changeMusic" refName="mysong" :userInfo="userInfo" @updateUserInfo="updateUserInfo" />
          </b-tab>
        </b-tabs>
      </div>

      <footer>
        <p>
          <strong onclick="window.open('https://github.com/ddulhddul/Top100Music_Crawling')">ddulh</strong>
          <small>ddulhddul@gmail.com</small>
        </p>
      </footer>

    </div>
  </div>
</template>

<script>
import MusicList from './components/MusicList.vue'
import Message from './components/Message.vue'
import MySong from './components/MySong.vue'

export default {
  components: {
    MusicList, Message, MySong
  },
  data(){
    return {
      player: undefined, // youtube 플레이어
      tab: '',
      currentMusic: {
        song: '',
        singer: '',
        videoTime: '',
      },
      playType: 's',
      videoHidden: false,
      firstVideoHidden: false,
      musicList: [],
      yymmddhh: '',

      top100List: [],
      popList: [],
      userInfo: undefined,
      initMessageInfo: {}
    }
  },
  mounted(){
    this.changeTab()
    this.importYoutubeAPI()
  },
  methods: {
    updateUserInfo(userInfo){
      this.userInfo = userInfo
      this.musicList = ((userInfo||{}).music||{}).default || []
    },
    // 음악 변경
    async changeMusic(data){
      console.log('changeMusic', data)
      if(data.videoId){
        this.updateCurrentMusic(data)
        return
      }
      const res = await this.ajax({url: `/song/change?yymmddhh=${this.yymmddhh}&song=${data.song}&singer=${data.singer}`})
      this.updateCurrentMusic({...data, ...res.data})
    },
    // currentMusic update 및 load youtube
    updateCurrentMusic(obj={}){
      this.currentMusic = obj
      if (this.player && this.player.cuePlaylist && obj.videoId) {
        this.player.cuePlaylist([obj.videoId])
        this.musicList = this.musicList.map((music)=>{
          return {
            ...music,
            selected: music.num === obj.num
          }
        })
        this.setVideoTitleAndPlay(obj)
      }
    },
    // 제목 Title 변경
    setVideoTitleAndPlay(param){
      const obj = param || this.musicList.find((obj)=>obj.selected)
      const wrapContent = document.getElementsByName(this.tab)[0]
      if(!obj){
        if(wrapContent) wrapContent.scrollTop = 0
        return
      }
      if(obj.song) document.title = `${obj.song}` + (obj.singer? ` - ${obj.singer}`: '') + (!obj.videoTime?'':` (${obj.videoTime})`)
      if(document.getElementsByName(`${this.tab}${obj.num}`).length && obj.tab == this.currentMusic.tab){
        wrapContent.scrollTop = document.getElementsByName(`${this.tab}${obj.num}`)[0].offsetTop
      }
    },
    async callChartListByTab(tab){
      const res = await this.ajax({url: '/song/list/'+tab})
      return res.data || {}
    },
    // 탭 변경
    async changeTab(tab='top100'){
      this.tab = tab
      if(tab == 'top100'){
        if(!this.top100List.length){
          const data = await this.callChartListByTab(tab)
          this.yymmddhh = data.yymmddhh
          this.top100List = (data.list || []).map((obj)=>{return {...obj, tab}})
        }
        this.musicList = this.top100List

      }else if(tab == 'pop'){
        if(!this.popList.length){
          const data = await this.callChartListByTab(tab)
          this.yymmddhh = data.yymmddhh
          this.popList = (data.list || []).map((obj)=>{return {...obj, tab}})
        }
        this.musicList = this.popList
      }else if(tab == 'mysong'){
        this.musicList = ((this.userInfo||{}).music||{}).default || []
      }
      // selected song 체크
      this.musicList = this.musicList.map((obj)=>{
        return {
          ...obj,
          selected: (obj.tab == this.currentMusic.tab && obj.num == this.currentMusic.num)? true: false
        }
      })
      this.$nextTick(()=>{
        this.setVideoTitleAndPlay()
      })
    },
    // 초기 Player 로딩시
    startPlayer(){
      setTimeout(() => {
        if (this.player && this.player.cuePlaylist && this.musicList && this.musicList[0]) {
          this.changeMusic(this.musicList[0])
        }else this.startPlayer()
      }, 500)
    },
    // 일시정지
    pauseYoutube(){
      this.player && this.player.pauseVideo()
    },
    // 재생
    playYoutube(){
      this.player && this.player.playVideo()
    },
    // 다음
    nextSong(){
      let list = this.musicList || []
      if(!list.length) return
      let nextSong = undefined
      if(this.playType === '1'){
        nextSong = this.currentMusic

      }else if(this.playType === 'r'){
        list = list.filter((obj)=>!obj.selected)
        nextSong = list[Math.ceil(Math.random()*list.length)]

      }else if(this.playType === 's'){
        const index = list.reduce((entry, obj, index)=>{
          if(entry === 'e' && obj.selected) return index
          else return entry
        }, 'e')
        nextSong = list[index+1] || list[0]
      }
      if(nextSong) this.changeMusic(nextSong)
    },

    /*****************************
     * Create youtube player
     *   https://developers.google.com/youtube/iframe_api_reference?hl=ko
    *****************************/
    // videoId : 공유URL(http://youtu.be/UaY9xbHmVAc)에서 'http://youtu.be'만 제거한 아이디
    // playerVars : autoplay-자동시작, controls-하단컨트롤 사용여부, html5-html5 사용여부
    importYoutubeAPI(){
      let script = document.createElement('script')
      script.src = 'https://www.youtube.com/player_api'
      document.getElementsByTagName('head')[0].appendChild(script)
      this.onYouTubePlayerAPIReady()
    },
    onYouTubePlayerAPIReady() {
      if(typeof YT === 'undefined' || !YT.Player){
        setTimeout(() => {
          this.onYouTubePlayerAPIReady()
        }, 500)
        return
      }
      try {
        const curThis = this
        if(!this.player) this.player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          videoId: '',
          playerVars: { 'autoplay': 1, 'controls': 1, 'html5': 1, 'origin':'http://localhost:3000' },
          events: {
            onReady(event) {
              curThis.startPlayer()
            },
            onStateChange(event) {
              // console.log('event', event.data, event)
              if (event.data === 5) { // 동영상 신호
                curThis.player.playVideo()

              } else if (event.data === 0) { // 종료 (동영상 끝난 후 이벤트)
                curThis.nextSong()

              } else if (event.data === 1) { // 재생 중
                if(!curThis.firstVideoHidden){
                  curThis.videoHidden = true
                  curThis.firstVideoHidden = true
                }

              } else if (event.data === 2) { // 일시정지

              } else if (event.data === -1) { // 시작되지 않음
                curThis.player.playVideo()
              }

            },
            onError(event) {
              if (curThis.videoHidden) curThis.nextSong()
            }
          }
        })
      } catch (error) {
        console.log('YT Player error', error)
        this.onYouTubePlayerAPIReady()
      }

    }
  }
}
</script>

<style>
.wrap-all {
  display: flex;
  justify-content: center;
}
.contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
}
.wrap-date {
  cursor: default;
  position: absolute;
  right: 2px;
  top: -5px;
  color: grey;
}
.wrap-title {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  /* width: 80%; */
}
.wrap-youtube {
  max-width: 600px;
}
.wrap-buttons {
  margin: 10px;
}
.wrap-tabs {
  width: 95%;
}
footer {
  cursor: default;
}
footer strong {
  cursor: pointer;
}

.form_table{
  background: #fff;
  clear: both;
  width: 100%;
  margin-bottom: 10px;
  border-collapse: collapse;
  border-top: 1px solid rgba(0,0,0,0.2);
  table-layout: fixed;
}
.form_table th, .form_table td{
  padding: 5px;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  vertical-align: top;
  line-height: 24px;
}
.form_table th{
  background: rgba(0,0,0,0.3);
  padding: 5px 0 0 10px;
  height: 39px;
}
.form_table tr:hover td{background: #f4f6fd;}

input[type="text"], input[type="password"], input[type="search"], input[type="date"]{
  border: 1px solid #cccccc;
  height: 28px;
  border-radius: 0px;
  padding: 3px;
  width: 100%;
}
.tr{text-align: right;}
.tc{text-align: center;}
.no_data{
  padding: 10px 0 10px;
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
}
.modal_open {
  overflow: hidden;
  height: 100%;
}
</style>
