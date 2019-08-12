<template>
  <div class="list_wrap">
    <div ref="list_thead_wrap" class="list_thead_wrap">
      <table class="list_table">
        <slot name="colgroup"></slot>
        <thead>
          <slot name="thead"></slot>
        </thead>
      </table>
    </div>
    <div ref="scrollDiv" @scroll="handleScroll" :class="{list_table_wrap_y: true}">
      <table class="list_table">
        <slot name="colgroup"></slot>
        <tbody>
          <template v-if="list && list.length">
            <slot name="tbody"></slot>
          </template>
          <tr v-else>
            <!-- 좌우 스크롤 표시를 위해, display table-column 적용 -->
            <td style="display:table-column;"></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list || !list.length" class="no_data">
        No Data Found
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    list: {type: Array},
    search: {type: Function},
    pageObject: [Object, String] // currentPage, maxYn
  },
  data: ()=>({
    lastIndex: 0
  }),
  watch: {
    pageObject: function (obj={}) {
      if(obj.currentPage == 1){
        this.$refs.scrollDiv.scrollTop = 0
        this.lastIndex = 0
      }
    }
  },
  methods: {
    handleScroll (event) {
      // 가로 스크롤
      this.$refs.list_thead_wrap.scrollLeft = this.$refs.scrollDiv.scrollLeft

      const eventDiv = event.target
      if (eventDiv.offsetHeight + eventDiv.scrollTop + 5 >= eventDiv.scrollHeight) {
        const pageObject = this.pageObject
        if(pageObject.maxYn != 'Y'){
          const nextPageIndex = Number(pageObject.currentPage||0)+1
          if(this.lastIndex < nextPageIndex){
            this.lastIndex = nextPageIndex
            this.$emit('search', {pageIndex: nextPageIndex})
          }
        }
      }
    }
  },
};
</script>
<style scoped>
.list_wrap {height: 100%;}
.list_table {width: 100%; table-layout: fixed; word-break: break-word;}
.list_thead_wrap {position: relative;width: 100%;overflow-y: scroll;
  -ms-scrollbar-highlight-color: white;
  -ms-scrollbar-arrow-color: white;
}
.list_thead_wrap::-webkit-scrollbar {opacity: 0;
}
.list_table_wrap_y {overflow-y: scroll; overflow-x: auto; position: relative; height: 100%;}
</style>