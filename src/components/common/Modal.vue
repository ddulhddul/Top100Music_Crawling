<template>
  <div class="modal_mask" name="modal">
    <transition>
      <div :class="Object.assign({}, modalWrapperClass||{}, {modal_wrapper: true})">
        <div class="modal_container" ref="modal_container" :class='size' :style="containerStyle"><!-- big,large,medium,small -->
          <div class="modal_header" v-if="$slots.header && $slots.header.length">
            <slot name="header"></slot> 
            <a class="btn_close" title="Close" @click="onClose()"></a> 
          </div> 
          <div class="modal_body">
            <slot name="body"></slot>
          </div>
          <div class="modal_footer" v-if="$slots.footer && $slots.footer.length">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script> 
export default {
  data(){ 
    return { 
      size: undefined,
      modalWrapperClass: null,
      containerStyle: {}, 
    } 
  }, 
  mounted(){ 
    this.size = this.$attrs.size || 'big' 
    if(document.querySelector('.modal_mask')){ 
      document.querySelector('body').classList.add('modal_open') 
    } 
  }, 
  destroyed(){ 
    if(!document.querySelectorAll('.modal_mask').length){ 
      document.querySelector('body').classList.remove('modal_open') 
    } 
  }, 
  methods: { 
    onClose(){ 
      this.$emit('close') 
    } 
  } 
}
</script> 