<template>
  <div class="wrap-contents" :name="refName">
    <table class="basicTable">
      <colgroup>
        <col width='40px' />
        <col />
        <col v-if="!noSinger" width='35%' />
      </colgroup>
      <thead>
        <tr>
          <th class="tc">#</th>
          <th>song</th>
          <th v-if="!noSinger">singer</th>
          <th v-else></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(music,index) in thisMusicList" :key="index" :name="`${refName}${music.num}`" :class='{selected: music.selected}'>
          <td @click="changeMusic(music)" class="tc">{{ music.num }}</td>
          <td @click="changeMusic(music)">{{ music.song }}</td>
          <td @click="changeMusic(music)" v-if="!noSinger">{{ music.singer }}</td>
          <td v-else>
            <button type="button" @click="deleteSong(music)" class="btn btn-sm btn-danger">X</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no_data" v-if="!thisMusicList || !thisMusicList.length">
      No Music Found
    </div>
  </div>
</template>

<script>
export default {
  props: {
    noSinger: Boolean,
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
    deleteSong(music){
      this.$emit('deleteSong', music)
    },
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
