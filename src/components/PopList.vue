<template>
  <Music-List :musicList="popList" @changeMusic="changeMusic" refName="pop" />  
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
      'popList'
    ])
  },
  props: {
    tab: String
  },
  watch: {
    async tab(newValue, oldValue){
      if(newValue == 'pop'){
        if(!this.init){
          this.init = true
          this.initMusicList()
        }
        this.$emit('updateMusicList', this.popList || [])
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
      const res = await this.ajax({url: '/song/list/pop'})
      const data = res.data || {}
      this.$store.commit('setYymmddhh', data.yymmddhh)
      this.$store.commit('setPopList', (data.list || []).map((obj)=>{return {...obj, tab: 'pop'}}))
    },
    
    changeMusic(music){
      this.$emit('changeMusic', music)
    }

  }
}
</script>