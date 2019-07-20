<template>
  <div class="wrap-contents">
    <table class="messageTable">
      <colgroup>
        <col width='40px' />
        <col />
        <col width='35%' />
      </colgroup>
      <tbody>
        <tr v-for="(message,index) in messageList" :key="index">
          <td class="tc">{{ message.num }}</td>
          <td>{{ message.song }}</td>
          <td>{{ message.singer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    initMessageInfo: Object
  },
  data(){
    return {
      messageList: []
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
.messageTable{
  cursor: default;
  width: 100%;
}
.messageTable tr{
  height: 30px;
  border-bottom: 1px;
  border-bottom-color: grey;
  border-bottom-style: dotted;
}
.messageTable td,th{
  padding-left: 10px;
  padding-right: 10px;
}
.tr{text-align: right;}
.tc{text-align: center;}
</style>