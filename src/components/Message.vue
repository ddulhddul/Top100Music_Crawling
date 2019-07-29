<template>
  <div class="wrap-contents">
    <Scroll-Table :list="messageList" pageObject="N">
      <colgroup slot="colgroup">
        <col width="100%" />
      </colgroup>
      <template slot="tbody">
        <tr v-for="message in messageList">
          <td>{{ JSON.stringify(message) }}</td>
        </tr>
      </template>
    </Scroll-Table>
  </div>
</template>

<script>
import ScrollTable from './common/ScrollTable.vue'

export default {
  components: {
    ScrollTable
  },
  props: {
    initMessageInfo: Object
  },
  data(){
    return {
      messageList: Array.from(Array(100)).map((obj, index)=> index)
    }
  },
  mounted(){
  },
  methods: {
  }
}
</script>

<style scoped>
.wrap-contents {
  width: 95%;
  height: 400px;
  overflow-y: auto;
}
</style>