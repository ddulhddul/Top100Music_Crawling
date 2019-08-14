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
          await this.initMusicList()
          this.init = true
        }
      }
    }
  },
  methods: {

    async initMusicList () {
      const res = await this.ajax({
        url: '/song/list/top100',
        params: {
          initYn: !this.init ? 'Y' : 'N',
          userId: this.getStorageItem('userId')
        }
      })
      const data = res.data || {}
      const removedTop100List = this.getRemovedTop100List()
      this.$store.commit('setTop100List', (data.list || []).map((obj) => {
        return {
          ...obj,
          tab: 'top100',
          removed: !!removedTop100List.find((removed) => removed.song === obj.song && removed.singer === obj.singer)
        }
      }))
      data.userInfo && this.$store.dispatch('setMusicListByUserInfo', { ...data.userInfo })
    },

    remove (music) {
      const musicList = (this.top100List || []).map((obj) => {
        return {
          ...obj,
          removed: !music ? true : (music.song === obj.song && music.singer === obj.singer) ? true : obj.removed
        }
      })
      this.$store.commit('setTop100List', musicList)
      this.setRemovedTop100List(musicList)
    },

    add (music) {
      const musicList = (this.top100List || []).map((obj) => {
        return {
          ...obj,
          removed: !music ? false : (music.song === obj.song && music.singer === obj.singer) ? false : obj.removed
        }
      })
      this.$store.commit('setTop100List', musicList)
      this.setRemovedTop100List(musicList)
    },

    getRemovedTop100List () {
      let returnValue
      try {
        const removedTop100ListJson = this.getStorageItem('removedTop100List')
        if (removedTop100ListJson) returnValue = JSON.parse(removedTop100ListJson)
      } catch (error) {
        console.log('get removedTop100List error', error)
      }
      return returnValue || []
    },

    setRemovedTop100List (musicList = []) {
      this.setStorageItem('removedTop100List', JSON.stringify(musicList.reduce((entry, obj) => {
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
