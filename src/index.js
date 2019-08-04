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
    yymmddhh: '',
    currentMusic: {},
    top100List: [],
    popList: [],
    userInfo: undefined
  },
  mutations: {
    setYymmddhh(state, payload=''){
      state.yymmddhh = payload
    },
    setCurrentMusic(state, payload={}){
      state.currentMusic = payload
    },
    setTop100List(state, payload=[]){
      state.top100List = payload.map((obj)=>{return {...obj, tab: 'top100'}})
    },
    setPopList(state, payload=[]){
      state.popList = payload.map((obj)=>{return {...obj, tab: 'pop'}})
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