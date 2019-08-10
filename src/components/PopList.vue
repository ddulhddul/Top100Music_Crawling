<template>
  <div class="wrapper-musiclist">
    <Music-List :musicList="popList" @changeMusic="changeMusic" @remove="remove" @add="add" refName="pop" />  
  </div>
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
      this.$store.commit('setPopList', (data.list || []).map((obj)=>{return {...obj, tab: 'pop'}}))
    },

    remove(music){
      this.$store.commit('setPopList', (this.popList||[]).map((obj)=>{
        return {
          ...obj,
          removed: !music? true: (music.song == obj.song && music.singer == obj.singer)? true: obj.removed
        }
      }))
    },

    add(music){
      this.$store.commit('setPopList', (this.popList||[]).map((obj)=>{
        return {
          ...obj,
          removed: !music? false: (music.song == obj.song && music.singer == obj.singer)? false: obj.removed
        }
      }))
    },
    
    changeMusic(music){
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