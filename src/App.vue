<template>
  <div>
    <div>
      <!-- Title -->
      <h4>
        <strong>{{ currentMusic.song }}</strong>
        <small v-if="currentMusic.videoTime">
          ({{ currentMusic.videoTime }})
        </small>
        <span style="white-space: nowrap">
          <small>{{ currentMusic.singer }}</small>
        </span>
      </h4>
      <!-- Youtube -->
      <div :style='{display: videoHidden? "none": "block"}'>
        <div id="player"></div>
      </div>
      <div>
        <b-button variant="danger" @click='videoHidden=!videoHidden'>
          {{ !videoHidden? 'Hidden': 'Show' }}
        </b-button>
      </div>
      <!-- Playtype 설정 -->
      <div role="group" class="btn-group">
        <button type="button" @click="playType='1'" :class='playType == "1" ? "btn-info" : ""' style="font-weight:bold;"
          class="btn btn-default">1</button>
        <button type="button" @click="playType='s'" :class='playType == "s" ? "btn-info" : ""' class="btn btn-default">
          <span aria-hidden="true" class="glyphicon glyphicon-retweet"></span>
        </button>
        <button type="button" @click="playType='r'" :class='playType == "r" ? "btn-info" : ""' class="btn btn-default">
          <span aria-hidden="true" class="glyphicon glyphicon-random"></span>
        </button>
      </div>
      <div role="group" class="btn-group">
        <button type="button" @click="pauseYoutube()" class="btn btn-warning">
          <span aria-hidden="true" class="glyphicon glyphicon-pause"></span>
        </button>
        <button type="button" @click="playYoutube()" class="btn btn-primary">
          <span aria-hidden="true" class="glyphicon glyphicon-play"></span>
        </button>
        <button type="button" @click="nextSong()" class="btn btn-danger">
          <span aria-hidden="true" class="glyphicon glyphicon-forward"></span>
        </button>
      </div>
    </div>

    <!-- Tab -->
    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="Top100" :class="{active: tab=='musicList'}" @click="initTab('musicList')"></b-tab>
        <b-tab title="Pop" :class="{active: tab=='popsong'}" @click="initTab('popsong')"></b-tab>
        <b-tab title="Messages" :class="{active: tab=='message'}" @click="initTab('message')"></b-tab>
      </b-tabs>
    </div>

    <div>
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      player: undefined, // youtube 플레이어
      tab: '',
      currentMusic: {
        song: '노래',
        singer: '가수',
        videoTime: '시간',
      },
      playType: 's',
      videoHidden: false,
      musicList: [],
      yymmddhh: '',
    }
  },
  async mounted(){
    // const res = await this.ajax({
    //     url: '/song/list'
    // })
    // const data = res.data
    // this.musicList = data.result || []
    // this.yymmddhh = data.yymmddhh
    this.musicList = [{"num":1,"song":"사랑에 연습이 있었다면 (Prod. 2soo)","singer":"임재현","srch":"사랑에 연습이 있었다면  임재현"},{"num":2,"song":"작은 것들을 위한 시 (Boy With Luv) feat. Halsey","singer":"방탄소년단","srch":"작은 것들을 위한 시  feat. Halsey 방탄소년단"},{"num":3,"song":"너에게 못했던 내 마지막 말은","singer":"다비치","srch":"너에게 못했던 내 마지막 말은 다비치"},{"num":4,"song":"2002","singer":"Anne-Marie","srch":"2002 Anne-Marie"},{"num":5,"song":"주저하는 연인들을 위해","singer":"잔나비","srch":"주저하는 연인들을 위해 잔나비"},{"num":6,"song":"bad guy","singer":"Billie Eilish (빌리 아일리시)","srch":"bad guy Billie Eilish "},{"num":7,"song":"AH YEAH (아예)","singer":"WINNER","srch":"AH YEAH  WINNER"},{"num":8,"song":"FANCY","singer":"TWICE (트와이스)","srch":"FANCY TWICE "},{"num":9,"song":"Goodbye","singer":"박효신","srch":"Goodbye 박효신"},{"num":10,"song":"노래방에서","singer":"장범준","srch":"노래방에서 장범준"},{"num":11,"song":"나만, 봄","singer":"볼빨간사춘기","srch":"나만, 봄 볼빨간사춘기"},{"num":12,"song":"사계 (Four Seasons)","singer":"태연 (TAEYEON)","srch":"사계  태연 "},{"num":13,"song":"교통정리 (Feat. 헤이즈)","singer":"기리보이","srch":"교통정리  기리보이"},{"num":14,"song":"Kill This Love","singer":"BLACKPINK","srch":"Kill This Love BLACKPINK"},{"num":15,"song":"그때가 좋았어","singer":"케이시 (Kassy)","srch":"그때가 좋았어 케이시 "},{"num":16,"song":"사월이 지나면 우리 헤어져요 (Beautiful goodbye)","singer":"첸 (CHEN)","srch":"사월이 지나면 우리 헤어져요  첸 "},{"num":17,"song":"소우주 (Mikrokosmos)","singer":"방탄소년단","srch":"소우주  방탄소년단"},{"num":18,"song":"사계 (하루살이)","singer":"엠씨더맥스","srch":"사계  엠씨더맥스"},{"num":19,"song":"옥탑방 (Rooftop)","singer":"엔플라잉 (N.Flying)","srch":"옥탑방  엔플라잉 "},{"num":20,"song":"Make It Right","singer":"방탄소년단","srch":"Make It Right 방탄소년단"},{"num":21,"song":"달라달라","singer":"ITZY (있지)","srch":"달라달라 ITZY "},{"num":22,"song":"봄날","singer":"방탄소년단","srch":"봄날 방탄소년단"},{"num":23,"song":"별 보러 갈래?","singer":"볼빨간사춘기","srch":"별 보러 갈래? 볼빨간사춘기"},{"num":24,"song":"뜨거운 여름밤은 가고 남은 건 볼품없지만","singer":"잔나비","srch":"뜨거운 여름밤은 가고 남은 건 볼품없지만 잔나비"},{"num":25,"song":"Dionysus","singer":"방탄소년단","srch":"Dionysus 방탄소년단"},{"num":26,"song":"당신과는 천천히","singer":"장범준","srch":"당신과는 천천히 장범준"},{"num":27,"song":"사랑하긴 했었나요 스쳐가는 인연이었나요 짧지않은 우리 함께했던 시간들이 자꾸 내 마음을 가둬두네","singer":"잔나비","srch":"사랑하긴 했었나요 스쳐가는 인연이었나요 짧지않은 우리 함께했던 시간들이 자꾸 내 마음을 가둬두네 잔나비"},{"num":28,"song":"IDOL","singer":"방탄소년단","srch":"IDOL 방탄소년단"},{"num":29,"song":"HOME","singer":"방탄소년단","srch":"HOME 방탄소년단"},{"num":30,"song":"모든 날, 모든 순간 (Every day, Every Moment)","singer":"폴킴","srch":"모든 날, 모든 순간  폴킴"},{"num":31,"song":"다섯 번째 계절 (SSFWL)","singer":"오마이걸","srch":"다섯 번째 계절  오마이걸"},{"num":32,"song":"넘쳐흘러","singer":"엠씨더맥스","srch":"넘쳐흘러 엠씨더맥스"},{"num":33,"song":"Paris In The Rain","singer":"Lauv","srch":"Paris In The Rain Lauv"},{"num":34,"song":"비가 오잖아","singer":"소유 (SOYOU)","srch":"비가 오잖아 소유 "},{"num":35,"song":"Jamais Vu","singer":"방탄소년단","srch":"Jamais Vu 방탄소년단"},{"num":36,"song":"너를 만나","singer":"폴킴","srch":"너를 만나 폴킴"},{"num":37,"song":"벌써 12시","singer":"청하","srch":"벌써 12시 청하"},{"num":38,"song":"눈 (Prod. 기리보이)","singer":"강현준 (Lil tachi)","srch":"눈  강현준 "},{"num":39,"song":"비올레타","singer":"IZ*ONE (아이즈원)","srch":"비올레타 IZ*ONE "},{"num":40,"song":"돈 Call Me (Prod.BRLLNT)","singer":"염따","srch":"돈 Call Me  염따"},{"num":41,"song":"진심이 담긴 노래 (True Song)","singer":"케이시 (Kassy)","srch":"진심이 담긴 노래  케이시 "},{"num":42,"song":"Intro : Persona","singer":"방탄소년단","srch":"Intro : Persona 방탄소년단"},{"num":43,"song":"그건 아마 우리의 잘못은 아닐 거야","singer":"백예린","srch":"그건 아마 우리의 잘못은 아닐 거야 백예린"},{"num":44,"song":"고고베베 (gogobebe)","singer":"마마무(Mamamoo)","srch":"고고베베  마마무"},{"num":45,"song":"이 노래가 클럽에서 나온다면","singer":"우디 (Woody)","srch":"이 노래가 클럽에서 나온다면 우디 "},{"num":46,"song":"Way Back Home","singer":"숀 (SHAUN)","srch":"Way Back Home 숀 "},{"num":47,"song":"Love Shot","singer":"EXO","srch":"Love Shot EXO"},{"num":48,"song":"7 rings","singer":"Ariana Grande","srch":"7 rings Ariana Grande"},{"num":49,"song":"오월의 어느 봄날 (Feat. 첸(CHEN))","singer":"임한별","srch":"오월의 어느 봄날 ) 임한별"},{"num":50,"song":"멍청이(twit)","singer":"화사(Hwa Sa)","srch":"멍청이 화사"},{"num":51,"song":"comethru","singer":"Jeremy Zucker","srch":"comethru Jeremy Zucker"},{"num":52,"song":"thank u, next","singer":"Ariana Grande","srch":"thank u, next Ariana Grande"},{"num":53,"song":"오늘 밤에","singer":"홍진영","srch":"오늘 밤에 홍진영"},{"num":54,"song":"술이 달다 (Feat. Crush)","singer":"에픽하이 (EPIK HIGH)","srch":"술이 달다  에픽하이 "},{"num":55,"song":"띵 (Prod. By 기리보이)","singer":"Jvcki Wai","srch":"띵  Jvcki Wai"},{"num":56,"song":"이별하러 가는 길","singer":"임한별","srch":"이별하러 가는 길 임한별"},{"num":57,"song":"신용재","singer":"하은","srch":"신용재 하은"},{"num":58,"song":"봄 (feat. 산다라박)","singer":"박봄","srch":"봄  박봄"},{"num":59,"song":"YES or YES","singer":"TWICE (트와이스)","srch":"YES or YES TWICE "},{"num":60,"song":"180도","singer":"벤","srch":"180도 벤"},{"num":61,"song":"니 소식","singer":"송하예","srch":"니 소식 송하예"},{"num":62,"song":"초록빛","singer":"폴킴","srch":"초록빛 폴킴"},{"num":63,"song":"이 밤","singer":"양다일","srch":"이 밤 양다일"},{"num":64,"song":"SOLO","singer":"제니 (JENNIE)","srch":"SOLO 제니 "},{"num":65,"song":"Don`t Know What To Do","singer":"BLACKPINK","srch":"Don`t Know What To Do BLACKPINK"},{"num":66,"song":"MILLIONS","singer":"WINNER","srch":"MILLIONS WINNER"},{"num":67,"song":"Dance The Night Away","singer":"TWICE (트와이스)","srch":"Dance The Night Away TWICE "},{"num":68,"song":"신청곡 (Feat. SUGA of BTS)","singer":"이소라","srch":"신청곡  이소라"},{"num":69,"song":"내 생에 아름다운","singer":"케이윌","srch":"내 생에 아름다운 케이윌"},{"num":70,"song":"너도 그냥 날 놓아주면 돼","singer":"윤건","srch":"너도 그냥 날 놓아주면 돼 윤건"},{"num":71,"song":"She (Hidden Track No.V 1월 선정곡)","singer":"잔나비","srch":"She  잔나비"},{"num":72,"song":"BREATHE","singer":"AB6IX (에이비식스)","srch":"BREATHE AB6IX "},{"num":73,"song":"아낙네","singer":"MINO (송민호)","srch":"아낙네 MINO "},{"num":74,"song":"지나오다","singer":"닐로 (Nilo)","srch":"지나오다 닐로 "},{"num":75,"song":"너는 어땠을까","singer":"노을","srch":"너는 어땠을까 노을"},{"num":76,"song":"안녕하세요","singer":"김재환","srch":"안녕하세요 김재환"},{"num":77,"song":"고백","singer":"양다일","srch":"고백 양다일"},{"num":78,"song":"비","singer":"폴킴","srch":"비 폴킴"},{"num":79,"song":"삐삐","singer":"아이유","srch":"삐삐 아이유"},{"num":80,"song":"Tempo","singer":"EXO","srch":"Tempo EXO"},{"num":81,"song":"여자친구","singer":"하은요셉","srch":"여자친구 하은요셉"},{"num":82,"song":"밤편지","singer":"아이유","srch":"밤편지 아이유"},{"num":83,"song":"9-TEEN","singer":"세븐틴","srch":"9-TEEN 세븐틴"},{"num":84,"song":"GO HIGH (Feat. 우원재, 창모 (CHANGMO), The Quiett) (Prod. CODE KUNST)","singer":"이영지","srch":"GO HIGH , The Quiett)  이영지"},{"num":85,"song":"아름답고도 아프구나","singer":"비투비","srch":"아름답고도 아프구나 비투비"},{"num":86,"song":"그리워하다","singer":"비투비","srch":"그리워하다 비투비"},{"num":87,"song":"있어줄래","singer":"길구봉구","srch":"있어줄래 길구봉구"},{"num":88,"song":"너 없인 안 된다","singer":"비투비","srch":"너 없인 안 된다 비투비"},{"num":89,"song":"열애중","singer":"벤","srch":"열애중 벤"},{"num":90,"song":"흔한 이별","singer":"허각","srch":"흔한 이별 허각"},{"num":91,"song":"Superhuman","singer":"NCT 127","srch":"Superhuman NCT 127"},{"num":92,"song":"그러나","singer":"10cm","srch":"그러나 10cm"},{"num":93,"song":"BET BET","singer":"뉴이스트","srch":"BET BET 뉴이스트"},{"num":94,"song":"이유 (You)","singer":"시우민 (XIUMIN)","srch":"이유  시우민 "},{"num":95,"song":"SHE`S FINE","singer":"헤이즈 (Heize)","srch":"SHE`S FINE 헤이즈 "},{"num":96,"song":"여행","singer":"볼빨간사춘기","srch":"여행 볼빨간사춘기"},{"num":97,"song":"Good Day (Feat. 팔로알토) (Prod. 코드 쿤스트)","singer":"pH-1","srch":"Good Day   pH-1"},{"num":98,"song":"HOLLYWOOD","singer":"AB6IX (에이비식스)","srch":"HOLLYWOOD AB6IX "},{"num":99,"song":"가을 타나 봐","singer":"바이브","srch":"가을 타나 봐 바이브"},{"num":100,"song":"하루도 그대를 사랑하지 않은 적이 없었다","singer":"임창정","srch":"하루도 그대를 사랑하지 않은 적이 없었다 임창정"}]
    this.yymmddhh = "2019052616"

    this.initTab('musicList')
    this.tab = 'musicList'

    this.importYoutubeAPI()
  },
  methods: {
    initTab(name){
      this.$router.push({
        name,
        params: {
          musicList: this.musicList
        }
      })
    },
    /*****************************
     * Create youtube player
    *****************************/
    // videoId : 공유URL(http://youtu.be/UaY9xbHmVAc)에서 'http://youtu.be'만 제거한 아이디
    // playerVars : autoplay-자동시작, controls-하단컨트롤 사용여부, html5-html5 사용여부
    importYoutubeAPI(){
      let script = document.createElement('script')
      script.src = 'http://www.youtube.com/player_api'
      document.getElementsByTagName('head')[0].appendChild(script)
      this.onYouTubePlayerAPIReady()
    },
    onYouTubePlayerAPIReady() {
      if(typeof YT === 'undefined'){
        setTimeout(() => {
          this.onYouTubePlayerAPIReady()
        }, 500)
        return
      }
      this.player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: { 'autoplay': 1, 'controls': 1, 'html5': 1, 'origin':'http://localhost:3000' },
        events: {
          'onReady': function (event) {
            // if (ML_CHART.tabinfo[ML_CHART.tab].musicList.length) ML_CHART.changeMusic(ML_CHART.tabinfo[ML_CHART.tab].musicList[0])

          },
          'onStateChange': function (event) {
            // if (event.data === 5) {
            //   ML_CHART.playVideoCustom()

            // } else if (event.data === 0) {
            //   //동영상 끝난 후 이벤트
            //   ML_CHART.nextSong()
            
            // } else if (event.data === 2) { // 일시정지
            //   if(!ML_CHART.pauseTf) ML_CHART.playVideoCustom()

            // } else if (event.data === -1) ML_CHART.playVideoCustom()

          },
          'onError': function (event) {
            // if (ML_CHART.videoHidden) ML_CHART.nextSong();
          }
        }
      });
    }
  }
}
</script>

<style>
</style>
