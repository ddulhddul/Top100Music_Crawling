<template>
  <Music-List :musicList="top100List" @changeMusic="changeMusic" refName="top100" />  
</template>

<script>
import MusicList from './MusicList.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MusicList
  },
  computed: {
    ...mapState([
      'top100List'
    ])
  },
  props: {
    tab: String
  },
  watch: {
    async tab(newValue, oldValue){
      if(newValue == 'top100'){
        if(!this.init){
          this.init = true
          await this.initMusicList()
        }
        this.$emit('updateMusicList', this.top100List || [])
      }
    }
  },
  data(){
    return {
      init: false
    }
  },
  methods: {

    async initMusicList(){
      const res = await this.ajax({url: '/song/list/top100'})
      const data = res.data || {}
      this.$store.commit('setYymmddhh', data.yymmddhh)
      this.$store.commit('setTop100List', (data.list || []).map((obj)=>{return {...obj, tab: 'top100'}}))
    },
    
    changeMusic(music){
      this.$emit('changeMusic', music)
    }

  }
}
</script>