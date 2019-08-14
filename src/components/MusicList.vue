<template>
  <div
    class="wrap-contents basicTable"
    :name="refName"
  >
    <Scroll-Table
      :list="musicList"
      page-object="N"
    >
      <colgroup slot="colgroup">
        <col width="50px">
        <col>
        <col
          v-if="!noSinger"
          width="30%"
        >
        <col width="50px">
      </colgroup>
      <template slot="thead">
        <tr>
          <th class="tc">
            #
          </th>
          <th>song</th>
          <th v-if="!noSinger">
            singer
          </th>
          <th class="button-wrapper-th">
            <template v-if="!noSinger">
              <div>
                <button
                  type="button"
                  class="btn btn-sm btn-danger small-button button-th"
                  @click="$emit('remove')"
                >
                  -
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-success small-button button-th"
                  @click="$emit('add')"
                >
                  +
                </button>
              </div>
              <div style="font-size: 7px; padding-top: 13px;">
                {{ musicList.filter((obj) => obj.removed).length }}
                &nbsp;&nbsp;&nbsp;
                {{ musicList.filter((obj) => !obj.removed).length }}
              </div>
            </template>
          </th>
        </tr>
      </template>
      <template slot="tbody">
        <tr
          v-for="(music,index) in musicList"
          :key="index"
          :name="`${refName}${music.num}`"
          :class="{
            selected: (music.videoId && music.videoId == (currentMusic||{}).videoId),
            removed: music.removed
          }"
        >
          <td
            class="tc"
            @click="changeMusic(music)"
          >
            {{ music.num }}
          </td>
          <td @click="changeMusic(music)">
            {{ music.song }}
          </td>
          <td
            v-if="!noSinger"
            @click="changeMusic(music)"
          >
            {{ music.singer }}
          </td>
          <td class="button-wrapper">
            <button
              v-if="noSinger"
              type="button"
              class="btn btn-sm btn-danger"
              @click="deleteSong(music)"
            >
              X
            </button>
            <template v-else>
              <button
                v-if="!music.removed"
                type="button"
                class="btn btn-sm btn-danger small-button"
                @click="$emit('remove',music)"
              >
                -
              </button>
              <button
                v-else
                type="button"
                class="btn btn-sm btn-success small-button"
                @click="$emit('add',music)"
              >
                +
              </button>
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
  props: {
    noSinger: Boolean,
    refName: { type: String, default: undefined },
    musicList: { type: Array, default: () => [] }
  },
  data () {
    return {
      selectSongMode: false
    }
  },
  computed: {
    ...mapState([
      'currentMusic'
    ])
  },
  methods: {
    deleteSong (music) {
      this.$emit('deleteSong', music)
    },
    async changeMusic (music) {
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
