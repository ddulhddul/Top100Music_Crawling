<template>
  <div class="wrap-contents">
    <ValidationObserver ref="messageValidationArea">
      <table class="form_table">
        <colgroup>
          <col style="width: 30%">
          <col style="width: 50%">
          <col>
        </colgroup>
        <tbody>
          <tr>
            <td>
              <template v-if="(userInfo||{}).userId">
                <small>작성자</small>&nbsp;
                {{ (userInfo||{}).userId }}
              </template>
              <v-input
                v-else
                v-model="writer"
                name="작성자"
                placeholder="작성자"
                validate="required"
                maxlength="100"
                @keypress.enter.prevent="insertMessage()"
              />
            </td>
            <td>
              <v-input
                v-model="contents"
                name="메세지"
                placeholder="메세지"
                validate="required"
                maxlength="300"
                @keypress.enter.prevent="insertMessage()"
              />
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-success"
                @click="insertMessage()"
              >
                등록
              </button>
              <button
                type="button"
                class="btn btn-sm btn-default"
                @click="initMessage()"
              >
                조회
              </button>
            </td>
          </tr>
          <tr v-if="(userInfo||{}).userId=='admin'">
            <td colspan="3">
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="backupMessage()"
              >
                Backup
              </button>
              <textarea v-model="backup" />
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="insertMany()"
              >
                Insertmany
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </ValidationObserver>
    <Scroll-Table
      :list="messageList"
      :page-object="messagePageObject"
      @search="getMessage"
    >
      <colgroup slot="colgroup">
        <col width="30%">
        <col width="70%">
      </colgroup>
      <template slot="tbody">
        <tr
          v-for="message in messageList"
          :key="message._id"
        >
          <td>
            <div class="write-wrapper">
              {{ message.writer }}
            </div>
          </td>
          <td>
            <!-- <div class="contents-wrapper"> -->
            {{ message.contents }}
            <div class="date-wrapper">
              {{ String(message.date||'').replace(/(.{4})(.{2})(.{2})(.{2})(.{2})(.{2})/, '$1.$2.$3 $4:$5:$6') }}
            </div>
            <!-- </div> -->
          </td>
        </tr>
      </template>
    </Scroll-Table>
  </div>
</template>

<script>
import ScrollTable from './common/ScrollTable.vue'
import VInput from './common/VInput.vue'
import { ValidationObserver } from 'vee-validate'
import { mapState } from 'vuex'

export default {
  components: {
    ScrollTable, VInput, ValidationObserver
  },
  props: {
    tab: { type: String, default: undefined }
  },
  data () {
    return {
      init: false,
      writer: '',
      contents: '',
      backup: '',
      messageList: [],
      messagePageObject: {}
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  watch: {
    tab (newValue, oldValue) {
      if (newValue === 'message' && !this.init) {
        this.init = true
        this.initMessage()
      }
    }
  },
  methods: {

    initMessage () {
      this.getMessage({ pageIndex: 1 })
    },

    async getMessage (param = {}) {
      const res = await this.ajax({
        url: '/song/message/list',
        params: { ...param }
      })
      const list = res.data.list || []
      // console.log('message call', list)
      this.messageList = param.pageIndex === 1 ? list : this.messageList.concat(list)
      this.messagePageObject = res.data.pageObject || {}
    },

    async insertMessage () {
      if (!await this.validateFocus([this.$refs.messageValidationArea])) return
      const res = await this.ajax({
        url: '/song/message/insert',
        params: {
          writer: (this.userInfo || {}).userId || this.writer,
          contents: this.contents
        }
      })
      if (res.data.result !== 'SUCCESS') {
        alert('메세지 작성 에러')
        return
      }
      this.writer = ''
      this.contents = ''
      this.$refs.messageValidationArea.reset()
      this.initMessage()
    },

    async backupMessage () {
      const res = await this.ajax({
        url: '/song/message/listAll'
      })
      this.backup = JSON.stringify(res.data.list || [])
    },

    async insertMany () {
      const res = await this.ajax({
        url: '/song/message/insertMany',
        params: {
          json: this.backup
        }
      })
      if (res.data.result !== 'SUCCESS') {
        alert('메세지 작성 에러')
        return
      }
      this.initMessage()
    }

  }
}
</script>

<style scoped>
.wrap-contents {
  width: 100%;
  height: calc(100% - 60px);
}
.write-wrapper {
  font-weight: bold;
}
.date-wrapper {
  color: grey;
  font-size: 8px;
  text-align: right;
  margin-right: 10px;
}
.contents-wrapper {
  width: 100%;
}
</style>
