import axios from 'axios'
export default {
  methods: {

    ajax(param){
      return axios({
        method: 'GET',
        ...param
      })
    },

    async validateFocus(args){
      if(!args) console.error('validateFocus error')
      let list = args
      if(!(args instanceof Array)){
        list = Object.keys(args).map((arg)=> args[arg])
      }
      let invalidRef = undefined
      for await(const arg of list){
        const unitResult = await arg.validate()
        if(!unitResult && !invalidRef){
          invalidRef = arg
        }
      }
  
      //focus
      if(invalidRef){
        const elm = invalidRef.$vnode && invalidRef.$vnode.elm
        if(elm) elm.querySelector('.error') && elm.querySelector('.error').focus()
      }
  
      return invalidRef? false: true
    }

  }
}