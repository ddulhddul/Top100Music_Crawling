<template>
  <div class="wrapper-musiclist">
    <Music-List
      :music-list="popList"
      ref-name="pop"
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
      'popList'
    ])
  },
  watch: {
    async tab (newValue, oldValue) {
      if (newValue === 'pop') {
        if (!this.init) {
          this.init = true
          this.initMusicList()
        }
      }
    }
  },
  methods: {

    async initMusicList () {
      const res = await this.ajax({ url: '/song/list/pop' })
      const data = res.data || {}
      const removedPopList = this.getRemovedPopList()
      this.$store.commit('setPopList', (data.list || []).map((obj) => {
        return {
          ...obj,
          tab: 'pop',
          removed: !!removedPopList.find((removed) => removed.song === obj.song && removed.singer === obj.singer)
        }
      }))
    },

    remove (music) {
      const musicList = (this.popList || []).map((obj) => {
        return {
          ...obj,
          removed: !music ? true : (music.song === obj.song && music.singer === obj.singer) ? true : obj.removed
        }
      })
      this.$store.commit('setPopList', musicList)
      this.setRemovedPopList(musicList)
    },

    add (music) {
      const musicList = (this.popList || []).map((obj) => {
        return {
          ...obj,
          removed: !music ? false : (music.song === obj.song && music.singer === obj.singer) ? false : obj.removed
        }
      })
      this.$store.commit('setPopList', musicList)
      this.setRemovedPopList(musicList)
    },

    getRemovedPopList () {
      let returnValue
      try {
        const removedPopListJson = this.getStorageItem('removedPopList')
        if (removedPopListJson) returnValue = JSON.parse(removedPopListJson)
      } catch (error) {
        console.log('get removedPopList error', error)
      }
      return returnValue || []
    },

    setRemovedPopList (musicList = []) {
      this.setStorageItem('removedPopList', JSON.stringify(musicList.reduce((entry, obj) => {
        if (obj.removed) entry.push({ singer: obj.singer, song: obj.song })
        return entry
      }, [])))
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
