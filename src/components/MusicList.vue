<template>
  <div class="wrap-contents basicTable" :name="refName">
    <Scroll-Table :list="thisMusicList" pageObject="N">
      <colgroup slot="colgroup">
        <col width='50px' />
        <col />
        <col v-if="!noSinger" width='30%' />
        <col width='50px' />
      </colgroup>
      <template slot="thead">
        <tr>
          <th class="tc">#</th>
          <th>song</th>
          <th v-if="!noSinger">singer</th>
          <th class="button-wrapper-th">
            <template v-if="!noSinger">
              <button type="button" @click="$emit('remove')" class="btn btn-sm btn-danger small-button button-th">-</button>
              <button type="button" @click="$emit('add')" class="btn btn-sm btn-success small-button button-th">+</button>
            </template>
          </th>
        </tr>
      </template>
      <template slot="tbody">
        <tr v-for="(music,index) in thisMusicList" :key="index" :name="`${refName}${music.num}`" :class='{
            selected: (music.videoId && music.videoId == (currentMusic||{}).videoId),
            removed: music.removed
          }'>
          <td @click="changeMusic(music)" class="tc">{{ music.num }}</td>
          <td @click="changeMusic(music)">{{ music.song }}</td>
          <td @click="changeMusic(music)" v-if="!noSinger">{{ music.singer }}</td>
          <td class="button-wrapper">
            <button v-if="noSinger" type="button" @click="deleteSong(music)" class="btn btn-sm btn-danger">X</button>
            <template v-else>
              <button v-if="!music.removed" type="button" @click="$emit('remove',music)" class="btn btn-sm btn-danger small-button">-</button>
              <button v-else type="button" @click="$emit('add',music)" class="btn btn-sm btn-success small-button">+</button>
            </template>
          </td>
        </tr>
      </template>
    </Scroll-Table>
  </div>
</template>

<script>
import ScrollTable from './common/ScrollTable.vue'
import { mapState } from 'vuex'

export default {
  components: {
    ScrollTable
  },
  computed: {
    ...mapState([
      'currentMusic'
    ])
  },
  props: {
    noSinger: Boolean,
    refName: String,
    musicList: Array
  },
  data(){
    return {
      selectSongMode: false,
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
    async changeMusic(music){
      this.$emit('changeMusic', music)
    }
  }
}
</script>

<style scoped>
.wrap-contents {
  width: 100%;
  height: 100%;
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
.small-button {
  padding-bottom: 0px;
  padding-top: 0px;
  padding-right: 6px;
  padding-left: 6px;
}
.removed {
  background-color: #80808063;
  text-decoration: line-through;
}
.button-wrapper {
  text-align: center;
}
.button-wrapper-th {
  text-align: center;
  display: inline-block;
  padding-left: 0px;
  padding-right: 0px;
}
.button-th {
  position: relative;
  top: 12px;
}
</style>
