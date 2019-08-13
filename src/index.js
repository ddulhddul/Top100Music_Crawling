import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import common from './common'

import VeeValidate from 'vee-validate'
import validationMessage from './validationMessage'

import Vuex from 'vuex'
Vue.use(BootstrapVue)
Vue.mixin(common)
Vue.use(VeeValidate, {
  locale: 'validationMessage',
  dictionary: { validationMessage }
})
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    loading: false,
    currentMusic: {},
    top100List: [],
    popList: [],
    userInfo: undefined
  },
  mutations: {
    setLoading (state, payload = false) {
      document.body.style.overflow = payload ? 'hidden' : ''
      state.loading = payload
    },
    setCurrentMusic (state, payload = {}) {
      state.currentMusic = payload
    },
    setTop100List (state, payload = []) {
      state.top100List = payload.map((obj) => { return { ...obj, tab: 'top100' } })
    },
    setPopList (state, payload = []) {
      state.popList = payload.map((obj) => { return { ...obj, tab: 'pop' } })
    },
    setUserInfo (state, payload) {
      state.userInfo = payload
    }
  }
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
