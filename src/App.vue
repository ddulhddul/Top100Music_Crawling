<template>
  <div class="wrap-all">
    <div
      v-if="loading"
      class="loading"
    >
      <b-spinner
        variant="primary"
        label="Spinning"
        style="width: 3rem; height: 3rem;"
      />
    </div>
    <div class="contents">
      <!-- Date -->
      <div class="wrap-date">
        <small>{{ yymmddhh.replace(/(.{4})(.{2})(.{2})(.{2})/, '$2.$3') }}</small>
        <small>{{ yymmddhh.replace(/(.{4})(.{2})(.{2})(.{2})/, '$4:00') }}</small>
      </div>

      <!-- Title -->
      <div
        class="wrap-title"
        @click="setVideoTitleAndPlay()"
      >
        <h4>
          <strong>{{ currentMusic.song }}</strong>
          <span style="white-space: nowrap;"><small>{{ currentMusic.singer }}</small></span>
          <small v-if="currentMusic.videoTime">({{ currentMusic.videoTime }})</small>
        </h4>
      </div>

      <!-- Youtube -->
      <div
        class="wrap-youtube"
        :style="{display: videoHidden? &quot;none&quot;: &quot;block&quot;}"
      >
        <div id="player" />
      </div>

      <!-- Play Buttons -->
      <div class="wrap-buttons">
        <div class="btn-group btn-group-border">
          <button
            type="button"
            class="btn btn-sm"
            :class="{'btn-info': playType=='1', 'btn-light': playType!='1'}"
            @click="playType='1'"
          >
            <!-- 한곡 -->
            <img
              class="image22"
              :src="require('../static/icons/icons8-repeat-one-30.png')"
              :style="{filter: playType=='1'? 'invert(1)': ''}"
            >
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="{'btn-info': playType=='s', 'btn-light': playType!='s'}"
            @click="playType='s'"
          >
            <!-- 순차 -->
            <img
              class="image22"
              :src="require('../static/icons/icons8-repeat-30.png')"
              :style="{filter: playType=='s'? 'invert(1)': ''}"
            >
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="{'btn-info': playType=='r', 'btn-light': playType!='r'}"
            @click="playType='r'"
          >
            <!-- 랜덤 -->
            <img
              class="image20"
              :src="require('../static/icons/icons8-curly-arrow-24.png')"
              :style="{filter: playType=='r'? 'invert(1)': ''}"
            >
          </button>
        </div>
        &nbsp;
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-warning"
            @click="pauseYoutube()"
          >
            <!-- 일시정지 -->
            <img
              class="image22"
              :src="require('../static/icons/icons8-pause-24.png')"
              :style="{filter:'invert(1)'}"
            >
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="playYoutube()"
          >
            <!-- 재생 -->
            <img
              class="image22"
              :src="require('../static/icons/icons8-play-24.png')"
              :style="{filter:'invert(1)'}"
            >
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="nextSong()"
          >
            <!-- 다음 -->
            <img
              class="image22"
              :src="require('../static/icons/icons8-fast-forward-24.png')"
              :style="{filter:'invert(1)'}"
            >
          </button>
        </div>
        &nbsp;
        <button
          class="btn btn-sm"
          :class="{'btn-success': videoHidden, 'btn-secondary': !videoHidden}"
          @click="videoHidden=!videoHidden"
        >
          {{ !videoHidden? '숨김': '표시' }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="wrap-tabs">
        <b-tabs content-class="mt-3 wrap-b-tabs">
          <b-tab
            title="Top100"
            :class="{active: tab=='top100'}"
            @click="tab='top100'"
          >
            <Top100-List
              :tab="tab"
              @changeMusic="changeMusic"
            />
          </b-tab>
          <b-tab
            title="Pop"
            :class="{active: tab=='pop'}"
            @click="tab='pop'"
          >
            <Pop-List
              :tab="tab"
              @changeMusic="changeMusic"
            />
          </b-tab>
          <b-tab
            title="Messages"
            :class="{active: tab=='message'}"
            @click="tab='message'"
          >
            <Message :tab="tab" />
          </b-tab>
          <b-tab
            title="My Songs"
            :class="{active: tab=='mysong'}"
            @click="tab='mysong'"
          >
            <My-Song
              :tab="tab"
              @changeMusic="changeMusic"
            />
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
import Message from './components/Message.vue'
import MySong from './components/MySong.vue'
import Top100List from './components/Top100List.vue'
import PopList from './components/PopList.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Message, MySong, Top100List, PopList
  },
  data () {
    return {
      yymmddhh: '',
      player: undefined, // youtube 플레이어
      tab: '',
      playType: 's',
      videoHidden: false,
      firstVideoHidden: false
    }
  },
  computed: {
    ...mapState([
      'loading',
      'currentMusic',
      'top100List',
      'popList',
      'userInfo'
    ])
  },
  mounted () {
    this.tab = 'top100'
    this.onYouTubePlayerAPIReady()
  },
  methods: {
    // 음악 변경
    async changeMusic (data) {
      if (!data) return
      if (data.videoId) {
        this.updateCurrentMusic(data)
        return
      }
      const res = await this.ajax({
        url: `/song/change`,
        params: {
          yymmddhh: data.yymmddhh,
          tab: data.tab,
          num: data.num,
          song: data.song,
          singer: data.singer
        }
      })
      const currentMusic = { ...data, ...res.data, tab: data.tab }
      console.log('changeMusic', currentMusic)
      const changedList = this.getMusicListByTab(currentMusic.tab).map((obj) => {
        return { ...obj,
          videoId: obj.num === data.num ? currentMusic.videoId : obj.videoId
        }
      })
      if (currentMusic.tab === 'top100') this.$store.commit('setTop100List', changedList)
      else if (currentMusic.tab === 'pop') this.$store.commit('setPopList', changedList)
      else if (currentMusic.tab === 'mysong') {
        const userInfo = this.userInfo || { music: { default: [] } }
        userInfo.music.default = changedList
        this.$store.commit('setUserInfo', userInfo)
      }
      this.updateCurrentMusic(currentMusic)
    },
    // currentMusic update 및 load youtube
    updateCurrentMusic (obj = {}) {
      this.$store.commit('setCurrentMusic', obj)
      if (this.player && this.player.cuePlaylist && obj.videoId) {
        this.player.cuePlaylist([obj.videoId])
        this.setVideoTitleAndPlay(obj)
      }
    },
    // 제목 Title 변경
    setVideoTitleAndPlay (param) {
      const obj = param || this.currentMusic
      if (!obj) return
      const wrapContent = document.querySelector(`[name=${obj.tab}] .list_table_wrap_y`)
      if (obj.song) document.title = `${obj.song}` + (obj.singer ? ` - ${obj.singer}` : '') + (!obj.videoTime ? '' : ` (${obj.videoTime})`)
      this.yymmddhh = obj.yymmddhh || ''
      if (document.getElementsByName(`${obj.tab}${obj.num}`).length && obj.tab === this.currentMusic.tab) {
        if (wrapContent) wrapContent.scrollTop = document.getElementsByName(`${obj.tab}${obj.num}`)[0].offsetTop
      }
    },
    // 초기 Player 로딩시
    startPlayer () {
      setTimeout(() => {
        const list = this.getMusicListByTab()
        if (this.player && this.player.cuePlaylist && list && list[0]) {
          this.changeMusic(list[0])
        } else this.startPlayer()
      }, 500)
    },
    // 일시정지
    pauseYoutube () {
      this.player && this.player.pauseVideo()
    },
    // 재생
    playYoutube () {
      this.player && this.player.playVideo()
    },
    // tab으로 list 가져오기
    getMusicListByTab (tab = 'top100') {
      let list = []
      if (tab === 'top100') list = this.top100List
      else if (tab === 'pop') list = this.popList
      else if (tab === 'mysong') list = ((this.userInfo || {}).music || {}).default
      return list || []
    },
    // 다음
    nextSong () {
      const list = this.getMusicListByTab(this.currentMusic.tab).filter((obj) => !obj.removed)
      let nextSong
      if (this.playType === '1') {
        nextSong = this.currentMusic
      } else if (this.playType === 'r') {
        const randomList = list.filter((obj) => obj.videoId !== this.currentMusic.videoId)
        nextSong = randomList[Math.floor(Math.random() * randomList.length)]
      } else if (this.playType === 's') {
        const index = list.reduce((entry, obj, index) => {
          if (entry === 1000 && (obj.num === this.currentMusic.num)) return index
          else return entry
        }, 1000)
        nextSong = list[index + 1] || list[0]
      }
      this.changeMusic(nextSong || this.currentMusic)
    },

    /*****************************
     * Create youtube player
     *   https://developers.google.com/youtube/iframe_api_reference?hl=ko
    *****************************/
    // videoId : 공유URL(http://youtu.be/UaY9xbHmVAc)에서 'http://youtu.be'만 제거한 아이디
    // playerVars : autoplay-자동시작, controls-하단컨트롤 사용여부, html5-html5 사용여부
    onYouTubePlayerAPIReady () {
      if (typeof YT === 'undefined' || !window.YT.Player) {
        setTimeout(() => {
          this.onYouTubePlayerAPIReady()
        }, 500)
        return
      }
      try {
        const curThis = this
        if (!this.player) {
          this.player = new window.YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: '',
            playerVars: { autoplay: 1, controls: 1, html5: 1 },
            events: {
              onReady (event) {
                curThis.startPlayer()
              },
              onStateChange (event) {
              // console.log('event', event.data, event)
                if (event.data === 5) { // 동영상 신호
                  curThis.player.playVideo()
                  // 플레이하지 않는 경우 방지, 5초후 다시 실행
                  setTimeout(() => { curThis.player && curThis.player.getPlayerState() !== 1 && curThis.player.playVideo() }, 5000)
                } else if (event.data === 0) { // 종료 (동영상 끝난 후 이벤트)
                  curThis.nextSong()
                } else if (event.data === 1) { // 재생 중
                  if (!curThis.firstVideoHidden) {
                    curThis.videoHidden = true
                    curThis.firstVideoHidden = true
                  }
                } else if (event.data === 2) { // 일시정지

                } else if (event.data === -1) { // 시작되지 않음
                  curThis.player.playVideo()
                  // 플레이하지 않는 경우 방지, 5초후 다시 실행
                  setTimeout(() => { curThis.player && curThis.player.getPlayerState() !== 1 && curThis.player.playVideo() }, 5000)
                }
              },
              onError (event) {
                if (curThis.videoHidden) curThis.nextSong()
              }
            }
          })
        }
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
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  padding-bottom: 5%;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
}
.contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
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
  width: 100%;
  height: calc(100% - 150px);
}
.wrap-b-tabs {
  height: calc(100% - 65px);
}
.tabs, .tab-pane{height: 100%;}

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
.image22 {height: 22px; width: 22px;}
.image20 {height: 20px; width: 20px;}
.btn-group-border {
  border-color: grey;
  border-width: 1px;
  border-style: dotted;
  border-radius: 5px;
}
.loading {
  position: absolute;
  z-index: 999999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
