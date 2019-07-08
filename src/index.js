const div = document.createElement('div')
div.setAttribute('id', 'app')
document.body.prepend(div)

import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
Vue.use(Vuetify)

import App from './App.vue'
import common from './common'
Vue.mixin(common)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import MusicList from './components/MusicList.vue'
const router = new VueRouter({
  routes: [
    { path: 'musicList', name: 'musicList', component: MusicList, props: true },
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')