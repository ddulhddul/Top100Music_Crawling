const div = document.createElement('div')
div.setAttribute('id', 'app')
document.body.prepend(div)

import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import common from './common'
Vue.mixin(common)

new Vue({
  el: '#app',
  render: h => h(App)
})