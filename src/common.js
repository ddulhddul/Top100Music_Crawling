import axios from 'axios'
export default {
  methods: {
    ajax(param){
      return axios({
        method: 'GET',
        ...param
      })
    }
  }
}