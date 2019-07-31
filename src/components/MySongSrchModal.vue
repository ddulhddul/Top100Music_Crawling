<template>
  <Modal size="small" @close="close">
    <template slot="header">
      <h4>Youtube 노래 검색</h4>
    </template>
    <template slot="body">
      <div>
        <ValidationObserver ref="validationYoutubeSrchArea">
          <table class="form_table">
            <colgroup>
              <col style="width: 80%" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <v-input v-model="searchInput" name="검색어" validate="required" maxlength=100 @keypress.enter.prevent="search()" />
                </td>
                <td>
                  <button type="button" @click="search()" class="btn btn-sm btn-default">검색</button>
                </td>
              </tr>
            </tbody>
          </table>
        </ValidationObserver>
        <table class="form_table pointer_tr">
          <colgroup>
            <col />
            <col style="width: 60px;" />
            <col style="width: 100px;" />
          </colgroup>
          <tbody>
            <tr v-if="!searchResultList || !searchResultList.length">
              <td colspan=3 class="tc">No data Found</td>
            </tr>
            <tr v-for="data in searchResultList" @click="addToMySong(data)">
              <td>{{ data.title }}</td>
              <td>{{ data.videoTime }}</td>
              <td>{{ data.videoId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template slot="footer">
      <button type="button" @click="close" class="btn btn-sm btn-default">닫기</button>
    </template>
  </Modal>
</template>

<script>
import Modal from './common/Modal.vue'
import VInput from './common/VInput.vue'
import { ValidationObserver } from 'vee-validate'

export default {
  components: {
    Modal, VInput, ValidationObserver
  },
  props: {
    userId: String
  },
  data(){
    return {
      searchInput: '',
      searchResultList: []
    }
  },
  methods: {

    async search(){
      if(!await this.validateFocus([this.$refs.validationYoutubeSrchArea])) return
      const result = await this.ajax({
        url: `song/search?searchInput=${this.searchInput}`
      })
      this.searchResultList = result.data.list || []
    },

    async addToMySong(song={}){
      const res = await this.ajax({
        url: '/song/passport/updateMySongList',
        params: {
          ...song,
          userId: this.userId
        }
      })
      if(res.datda == 'DUP') alert('중복된 노래가 존재합니다.')
      else{
        this.$emit('getUserInfo')
        this.close()
      }
    },

    close(){
      this.$emit('close')
    }

  }
}
</script>

<style scoped>
.pointer_tr{
  cursor: pointer;
}
</style>