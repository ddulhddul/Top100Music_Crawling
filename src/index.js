const div = document.createElement('div')
div.setAttribute('id', 'app')
document.body.prepend(div)

import 'babel-polyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

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

import VeeValidate from 'vee-validate'
import validationMessage from './validationMessage'
Vue.use(VeeValidate, {
  locale: 'validationMessage',
  dictionary: { validationMessage }
})

import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    top100List: [],
    popList: [],
    userInfo: undefined
  },
  mutations: {
    setTop100List(state, payload=[]){
      state.top100List = payload
    },
    setPopList(state, payload=[]){
      state.popList = payload
    },
    setUserInfo(state, payload){
      state.userInfo = payload
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')