<template>
  <div class="wrapper-musiclist">
    <Music-List
      :music-list="top100List"
      ref-name="top100"
      @changeMusic="changeMusic"
      @remove="remove"
      @add="add"
    />
  </div>
</template>

<script>
import MusicList from './MusicList.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MusicList
  },
  props: {
    tab: { type: String, default: undefined }
  },
  data () {
    return {
      init: false
    }
  },
  computed: {
    ...mapState([
      'top100List'
    ])
  },
  watch: {
    async tab (newValue, oldValue) {
      if (newValue === 'top100') {
        if (!this.init) {
          this.init = true
          await this.initMusicList()
        }
      }
    }
  },
  methods: {

    async initMusicList () {
      const res = await this.ajax({ url: '/song/list/top100' })
      const data = res.data || {}
      this.$store.commit('setTop100List', (data.list || []).map((obj) => { return { ...obj, tab: 'top100' } }))
    },

    remove (music) {
      this.$store.commit('setTop100List', (this.top100List || []).map((obj) => {
        return {
          ...obj,
          removed: !music ? true : (music.song === obj.song && music.singer === obj.singer) ? true : obj.removed
        }
      }))
    },

    add (music) {
      this.$store.commit('setTop100List', (this.top100List || []).map((obj) => {
        return {
          ...obj,
          removed: !music ? false : (music.song === obj.song && music.singer === obj.singer) ? false : obj.removed
        }
      }))
    },

    changeMusic (music) {
      this.$emit('changeMusic', music)
    }

  }
}
</script>
<style scoped>
.wrapper-musiclist{
  width: 100%;
  height: calc(100% - 60px);
}
</style>
