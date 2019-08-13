<template>
  <div
    class="modal_mask"
    name="modal"
  >
    <transition>
      <div :class="Object.assign({}, modalWrapperClass||{}, {modal_wrapper: true})">
        <div
          ref="modal_container"
          class="modal_container"
          :class="size"
          :style="containerStyle"
        >
          <!-- big,large,medium,small -->
          <div
            v-if="$slots.header && $slots.header.length"
            class="modal_header"
          >
            <slot name="header" />
            <a
              class="btn_close"
              title="Close"
              @click="onClose()"
            />
          </div>
          <div class="modal_body">
            <slot name="body" />
          </div>
          <div
            v-if="$slots.footer && $slots.footer.length"
            class="modal_footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      size: undefined,
      modalWrapperClass: null,
      containerStyle: {}
    }
  },
  mounted () {
    this.size = this.$attrs.size || 'big'
    if (document.querySelector('.modal_mask')) {
      document.querySelector('body').classList.add('modal_open')
    }
  },
  destroyed () {
    if (!document.querySelectorAll('.modal_mask').length) {
      document.querySelector('body').classList.remove('modal_open')
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.modal_mask {
  position: fixed;
  z-index: 9998;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: table;
  transition: opacity .3s ease;
}
.modal_wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.modal_container.big {width: 1024px;}
.modal_container.large {width: 800px;}
.modal_container.medium {width: 580px;}
.modal_container.small {width: 420px;}
.modal_container {
  margin: 0px auto;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0, .33);
  padding: 10px;
}
.modal_header {
  position: relative;
  height: 60px;
}
.modal_header h3 {
  height: 60px !important;
  margin-top: 0px;
  color: rgba(0,0,0,9);
  background: rgba(0,0,0,0);
  border-top: 3px solid #0d2da2;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  font-size: 19px !important;
  padding: 14px 0 0 20px !important;
}
.modal_header .btn_close {
  position:absolute;
  top: 10px;
  right: 10px;
  display: inline-block;
  width: 26px;
  height: 26px;
  overflow: hidden;
  color: rgba(0,0,0,0);
  border:none;
  cursor: pointer;
}
.modal_header .btn_close:hover {
  background: none;
}
.modal_header .btn_close:hover::before, .modal_header .btn_close:hover::after {
  background: rgba(0,0,0,0.8);
}
.modal_header .btn_close::before, .modal_header .btn_close::after {
  content:'';
  position: absolute;
  height: 1px;
  width: 100%;
  top: 50%;
  left: 0;
  margin-top: -1px;
  background: rgba(0,0,0,0.4);
}
.modal_header .btn_close::before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.modal_header .btn_close::after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.modal_body {
  padding: 20px;
  max-height: 400px;
  overflow: auto;
  margin: 0;
}
.modal_footer {
  height: 60px;
  padding: 14px;
  text-align: right;
  border-top: 1px solid rgba(0,0,0,0.1)
}
</style>
