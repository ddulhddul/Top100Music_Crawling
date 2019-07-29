<template>
  <ValidationProvider :rules="thisValidate" :name="name">
    <div slot-scope="{ errors }" class="error_msg_wrap"
      @mouseover="mouseover"
      @mouseleave="mouseleave">
      <masked-input
        :placeholder="placeholder"
        :mask="thisMask"
        :guide="guide"
        :type="type"
        :class="{
          error: errors && errors[0], 
          tc: ['hh:mm', 'hh:mm:ss'].includes(mask),
          tr: (mask=='number' && allowLeadingZeroes===undefined),
          imeMode: imeMode !== undefined,
        }"
        v-model="thisValue"
        :maxlength="maxlength"
        v-on="$listeners"
        @input="input"
        @blur="blur"
        :ref="name"
        :disabled="disabled"
        :autofocus="autofocus"
        v-show="notShow===undefined"
      ></masked-input>
      <span class="error_msg" 
        v-if="errors && errors[0]"
        :style="showError" >
        {{ errors[0] }}
      </span>
    </div>
  </ValidationProvider>
</template>

<script>
import MaskedInput, {conformToMask} from 'vue-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { ValidationProvider } from 'vee-validate';
export default {
  // inject: ['$validator'],
  components: { MaskedInput, ValidationProvider },
  props: {
    placeholder: String,
    type: {type: String, default:'text'},
    name: {type: String},
    model: {type: String},
    validate: {type: String},
    value: {},
    maxlength: {default: 200},
    mask: {},
    disabled: {},
    mobile: {},
    notShow: {},
    autofocus: {},
    imeMode: {},
    // nubmer 일 경우, 0부터 시작해도 되는지
    allowLeadingZeroes: {},
    // nubmer 일 경우, 천단위 구분자
    thousandsSeparatorSymbol: {},
    // nubmer 일 경우, 소수점 자리수
    decimalLimit: {},
    // blur시, 대문자 치환여부
    upperCase: {},
  },
  data(){
    return {
      thisValidate: undefined,
      thisValue: undefined,
      thisMask: false,
      guide: false,
      showError: {display: this.mobile===undefined?'none':'block'}
    }
  },
  created(){
    this.thisValidate = this.validate
    this.makeMask(this.mask)

    // 초기 focus 잡히는것 방지
    // this.$refs[this.name].blur()
  },
  mounted(){
    const mask = this.mask
    if(!mask){
      this.thisValue = this.valueNullChk(this.value)
    }else{
      this.thisValue = conformToMask(
        this.valueNullChk(this.value),
        this.thisMask, 
        {guide: this.guide}
      ).conformedValue
    }
  },
  /* 처음 init시, formatting 된 값으로 setting 되도록 watch 함수 추가 */
  watch: {
    value: function(){
      const mask = this.mask
      if(!mask || !this.thisMask){
        this.thisValue = this.valueNullChk(this.value)
      }else{
        this.thisValue = conformToMask(
          this.valueNullChk(this.value),
          this.thisMask, 
          {guide: this.guide}
        ).conformedValue
      }
      this.getParentPassVal(this.thisValue)
    },
    mask: function(){
      this.makeMask(this.mask)
      this.getParentPassVal(this.thisValue)
    },
    validate: function(){
      this.thisValidate = this.validate
    }
  }, 
  methods: {
    valueNullChk(value){
      let returnValue = ''
      if(value !== null && value !== undefined){
        returnValue = String(value)
      }
      return returnValue
    },

    makeMask(mask){
      if(!mask){
        this.thisMask = false
      }else if(typeof mask === 'string'){
        if(mask === 'phone'){
          this.thisMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        }else if(mask === 'number'){
          this.thisMask = createNumberMask({
            integerLimit: 10,
            allowDecimal: this.decimalLimit === undefined? false: true,
            decimalLimit: this.decimalLimit || 0,
            prefix: '',
            suffix: '',
            allowLeadingZeroes: this.allowLeadingZeroes === undefined ? false : true,
            thousandsSeparatorSymbol: this.thousandsSeparatorSymbol === undefined ? ',' : (this.thousandsSeparatorSymbol || ''),
          })
        }else if(mask === 'zipcode'){ // 우편번호
          this.thisMask = (rawValue)=>{
            return this.valueNullChk(rawValue).replace(/[^0-9\-]/g, '').split('').map((char)=>{
              return /[0-9\-]/
            })
          }
        }else if(mask === 'numberAlpha'){  // 국가코드
          this.thisMask = (rawValue)=>{
            return this.valueNullChk(rawValue).replace(/[^0-9a-zA-Z]/g, '').split('').map((char)=>{
              return /[0-9a-zA-Z]/
            })
          }
        }else if(mask === 'resno'){  // 주민번호
          this.thisMask = (rawValue)=>{
            return this.valueNullChk(rawValue).replace(/[^0-9]/g, '').split('').reduce((entry, char, index)=>{
              if(index == 6) entry.push('-')
              entry.push(/[0-9]/)
              return entry
            }, [])
          }
        }else if(mask === 'hh:mm'){  // hh:mm
          this.thisMask = [/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/]

        }else if(mask === 'hh:mm:ss'){  // hh:mm:ss
          this.thisMask = [/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/]
        }
      }
    },
    input(value){
      if(typeof event === 'undefined' || !event || !event.target) return

      // number mask일때, 0인 값 안바뀌는현상 수정
      let thisValue = event.target.value
      if(this.mask == 'number' && event.data && !isNaN(event.data) && thisValue === '0'){
        thisValue = event.data
      }
      this.thisValue = this.valueNullChk(thisValue)
      this.getParentPassVal(this.thisValue)
      // this.errors && this.$validator.validate(this.name)
    },
    blur(event){
      let value = this.valueNullChk(event.target.value).trim()
      if(this.upperCase !== undefined) value = value.toUpperCase()
      if(this.mask === 'hh:mm'){
        let setVal = value.replace(/[^0-9]/g,'')
        let set1 = String(Math.min(Number(setVal.substring(0,2)), 23)).padStart(2, '0')
        let set2 = String(Math.min(Number(setVal.substring(2)), 59)).padStart(2, '0')
        value = `${set1}:${set2}`
      }else if(this.mask === 'hh:mm:ss'){
        let setVal = value.replace(/[^0-9]/g,'')
        let set1 = String(Math.min(Number(setVal.substring(0,2)), 23)).padStart(2, '0')
        let set2 = String(Math.min(Number(setVal.substring(2,4)), 59)).padStart(2, '0')
        let set3 = String(Math.min(Number(setVal.substring(4)), 59)).padStart(2, '0')
        value = `${set1}:${set2}:${set3}`
      }
      this.thisValue = value
      this.getParentPassVal(value)
    },
    getParentPassVal(targetValue){
      let parentPassValue = targetValue
      const mask = this.mask
      if(mask === 'phone'){
        parentPassValue = targetValue.replace(/[^0-9]/g,'')
      }else if(mask === 'number'){
        parentPassValue = targetValue.replace(/[^0-9\.]/g,'')
      }else if(mask === 'resno'){
        parentPassValue = targetValue.replace(/[^0-9]/g,'')
      }else if(mask === 'hh:mm'){
        parentPassValue = targetValue.replace(/[^0-9]/g,'')
      }else if(mask === 'hh:mm:ss'){
        parentPassValue = targetValue.replace(/[^0-9]/g,'')
      }
      this.$emit('input', parentPassValue)
    },

    mouseover(event){
      this.showError = {display: 'block'}

    },
    mouseleave(event){
      this.showError = {display: this.mobile===undefined?'none':'block'}
    },
  }
};
</script>
<style scoped>
.imeMode{
  -webkit-ime-mode:active; 
  -moz-ime-mode:active; 
  -ms-ime-mode:active; 
  ime-mode:active; 
}
</style>
