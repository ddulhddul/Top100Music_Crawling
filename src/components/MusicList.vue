<template>
  <div class="wrap-contents" :name="refName">
    <table class="basicTable">
      <colgroup>
        <col width='40px' />
        <col />
        <col width='35%' />
      </colgroup>
      <thead>
        <tr>
          <th class="tc">#</th>
          <th>song</th>
          <th>singer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(music,index) in thisMusicList" :key="index" :name="`${refName}${music.num}`" :class='{selected: music.selected}'>
          <td @click="changeMusic(music)" class="tc">{{ music.num }}</td>
          <td @click="changeMusic(music)">{{ music.song }}</td>
          <td @click="changeMusic(music)">{{ music.singer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    refName: String,
    musicList: Array
  },
  data(){
    return {
      selectSongMode: false,
      currentMusic: {},
      thisMusicList: [],
    }
  },
  beforeMount(){
    this.thisMusicList = this.musicList || []
  },
  watch: {
    musicList(musicList){
      this.thisMusicList = musicList || []
    }
  },
  methods: {
    changeMusic(music){
      this.$emit('changeMusic', music)
    }
  }
}
</script>

<style scoped>
.wrap-contents {
  width: 95%;
  height: 400px;
  overflow-y: auto;
}
.basicTable{
  cursor: default;
  width: 100%;
}
.basicTable tr{
  height: 50px;
  border-bottom: 1px;
  border-bottom-color: grey;
  border-bottom-style: dotted;
}
.basicTable td,th{
  padding-left: 10px;
  padding-right: 10px;
}
.basicTable tr.selected{
  background-color: blueviolet;
  color: white;
  font-weight: bold;
}
.tr{text-align: right;}
.tc{text-align: center;}
</style>
