<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="musicList"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.no }}</td>
        <td class="text-xs-right">{{ props.item.song }}</td>
        <td class="text-xs-right">{{ props.item.singer }}</td>
      </template>
    </v-data-table>

    
    <table>
      <colgroup>
        <col width='10%' />
        <col width='40%' />
        <col width='40%' />
        <col v-if="selectSongMode" />
      </colgroup>
      <thead>
        <tr>
          <th>#</th>
          <th>song</th>
          <th>singer</th>
          <th v-if="selectSongMode">
            <div>
              <button @click="removeAllSinger()">
                <span aria-hidden="true" class="glyphicon glyphicon-remove"></span> all
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(music,index) in musicList" :key="index"
          :class='{success: currentMusic.num == music.num}'>
          <td @click="changeMusic(music)">{{ music.num }}</td>
          <td @click="changeMusic(music)">{{ music.song }}</td>
          <td @click="changeMusic(music)">{{ music.singer }}</td>
          <td v-if="selectSongMode">
            <div>
              <button @click="removeSinger(music)">
                <span aria-hidden="true"></span> singer
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    musicList: Array
  },
  data(){
    return {
      selectSongMode: false,
      currentMusic: {},
      headers: [
        { text: '#', value: 'num' },
        { text: 'Song', value: 'song' },
        { text: 'Singer', value: 'singer' },
      ],
    }
  },
  methods: {
    changeMusic(){

    }
  }
}
</script>

<style>

</style>
