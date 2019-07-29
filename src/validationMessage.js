import { Validator } from 'vee-validate'

const messages = {
  'required': (field) => `${field} 항목은 필수 정보입니다.`.replace(/\$\{field\}/g,field),
}

const locale = {
  name: 'validationMessage',
  messages,
  attributes: {}
}

Validator.localize({ [locale.name]: locale })

export default locale