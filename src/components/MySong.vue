<template>
  <div class="wrapper">
    <div
      v-if="!userInfo"
      class="login-wrapper"
    >
      <small>** 당신의 개인정보는 1도 보호되지 않습니다 **</small>
      <div class="form_wrap">
        <ValidationObserver ref="validationArea">
          <table class="form_table">
            <colgroup>
              <col style="width: 30%;">
              <col>
            </colgroup>
            <tbody>
              <tr>
                <th>ID</th>
                <td>
                  <v-input
                    v-model="userId"
                    name="ID"
                    validate="required"
                    mask="numberAlpha"
                    maxlength="100"
                    autofocus
                    @keypress.enter.prevent="login()"
                  />
                </td>
              </tr>
              <tr>
                <th>Password</th>
                <td>
                  <v-input
                    v-model="userPassword"
                    name="Password"
                    validate="required"
                    mask="numberAlpha"
                    maxlength="100"
                    @keypress.enter.prevent="login()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </ValidationObserver>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-danger"
        @click="join()"
      >
        Join
      </button>
      <button
        type="button"
        class="btn btn-sm btn-success"
        @click="login()"
      >
        Login
      </button>
    </div>
    <div
      v-else
      class="mysong-wrapper"
    >
      <!-- 노래 검색 팝업 -->
      <My-Song-Srch-Modal
        v-if="srchModal"
        :user-id="(userInfo||{}).userId"
        @close="srchModal=false"
        @getUserInfo="getUserInfo()"
      />
      <div class="class-search-song">
        <h5>
          <small>안녕!?</small>
          <b>{{ userInfo.userId }}</b>
        </h5>
        <div>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="srchModal=true"
          >
            Search
          </button>&nbsp;
          <button
            type="button"
            class="btn btn-sm btn-success"
            @click="logout()"
          >
            Logout
          </button>
        </div>
      </div>
      <div class="wrapper-musiclist">
        <Music-List
          :music-list="((userInfo||{}).music||{}).default||[]"
          ref-name="mysong"
          :no-singer="true"
          @changeMusic="changeMusic"
          @deleteSong="deleteSong"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MusicList from './MusicList.vue'
import MySongSrchModal from './MySongSrchModal.vue'
import VInput from './common/VInput.vue'
import { ValidationObserver } from 'vee-validate'
import { mapState } from 'vuex'

export default {
  components: {
    MusicList, MySongSrchModal, VInput, ValidationObserver
  },
  props: {
    tab: { type: String, default: undefined }
  },
  data () {
    return {
      init: false,
      userId: '',
      userPassword: '',
      srchModal: false
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  watch: {
    async tab (newValue, oldValue) {
      if (newValue === 'mysong') {
        if (!this.init) {
          this.init = true
          const userId = this.getStorageItem('userId')
          if (userId) await this.getUserInfo(userId)
        }
      }
    }
  },
  methods: {

    async login (param = {}) {
      if (!await this.validateFocus([this.$refs.validationArea])) return
      const params = {
        userId: param.userId || this.userId,
        userPassword: param.userPassword || this.userPassword
      }
      const res = await this.ajax({
        url: '/song/passport/login',
        params
      })

      const data = res.data
      if (!data || data === 'INVALID') alert('정보가 일치하지 않습니다.')
      else if (data === 'NOTEXISTS') alert('존재하지 않는 ID 입니다.')
      else {
        this.userId = ''
        this.userPassword = ''
        this.$store.dispatch('setMusicListByUserInfo', { ...data })
        this.setStorageItem('userId', params.userId)
      }
    },

    async join () {
      if (!await this.validateFocus([this.$refs.validationArea])) return
      const param = {
        userId: this.userId,
        userPassword: this.userPassword
      }
      const res = await this.ajax({
        url: '/song/passport/join',
        params: param
      })

      const data = res.data
      if (data === 'EXISTS') alert('이미 존재하는 ID 입니다.')
      else this.login(param)
    },

    async getUserInfo (userId) {
      const res = await this.ajax({
        url: '/song/passport/getUserInfo',
        params: {
          userId: userId || this.userInfo.userId
        }
      })
      const data = res.data
      data && this.$store.dispatch('setMusicListByUserInfo', { ...data })
    },

    changeMusic (data) {
      this.$emit('changeMusic', data)
    },

    async deleteSong (song = {}) {
      await this.ajax({
        url: '/song/passport/updateMySongList',
        params: {
          deleteVideoId: song.videoId,
          userId: this.userInfo.userId
        }
      })
      this.getUserInfo()
    },

    logout () {
      this.userId = ''
      this.userPassword = ''
      this.$store.commit('setUserInfo', undefined)
      this.setStorageItem('userId', '')
    }

  }
}
</script>

<style scoped>
.wrapper{
  height: 100%;
  display: flex;
  justify-content: center;
}
.login-wrapper{
  text-align: center;
}
.mysong-wrapper{
  width: 100%;
}
.wrapper-musiclist{
  width: 100%;
  height: calc(100% - 80px);
}
.form_table tr{
  margin-top: 5px;
}
.class-search-song{
  display: flex;
  justify-content: space-between;
  min-width: 300px;
}
</style>
