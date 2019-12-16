import * as Joi from '@hapi/joi'
import cpf from './cpf'
import cnpj from './cnpj'

export { cpf, cnpj }

const joi = new Proxy(Joi, {
  get(o, name) {
    return o[name].bind(o);
  }
})
const { extend, string }  = joi

export default extend({
  base: string(),
  name: 'document',
  language: {
    cnpj: 'informado é inválido',
    cpf: 'informado é inválido'
  },
  rules: [{
    name: 'cnpj',
    validate (_params: any, value: string, state: any, options: any) {
      if (!cnpj.isValid(value)) {
        return this.createError('document.cnpj', { v: value }, state, options)
      }

      return value
    }
  }, {
    name: 'cpf',
    validate (_params: any, value: string, state: any, options: any) {
      if (!cpf.isValid(value)) {
        return this.createError('document.cpf', { v: value }, state, options)
      }

      return value
    }
  }]
})
