/*!
 * cpf-cnpj-validator v0.1.0
 * (c) 2019-present Carvalho, Vinicius Luiz <carvalho.viniciusluiz@gmail.com>
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Joi = require('@hapi/joi');

const BLACKLIST = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '12345678909'
];
const STRICT_STRIP_REGEX = /[.-]/g;
const LOOSE_STRIP_REGEX = /[^\d]/g;
const verifierDigit = (digits) => {
    const numbers = digits
        .split('')
        .map(number => {
        return parseInt(number, 10);
    });
    const modulus = numbers.length + 1;
    const multiplied = numbers.map((number, index) => number * (modulus - index));
    const mod = multiplied.reduce((buffer, number) => buffer + number) % 11;
    return (mod < 2 ? 0 : 11 - mod);
};
const strip = (number, strict) => {
    const regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
    return (number || '').replace(regex, '');
};
const format = (number) => {
    return strip(number).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};
const isValid = (number, strict) => {
    const stripped = strip(number, strict);
    if (!stripped) {
        return false;
    }
    if (stripped.length !== 11) {
        return false;
    }
    if (BLACKLIST.includes(stripped)) {
        return false;
    }
    let numbers = stripped.substr(0, 9);
    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);
    return numbers.substr(-2) === stripped.substr(-2);
};
const generate = (formatted) => {
    let numbers = '';
    for (let i = 0; i < 9; i += 1) {
        numbers += Math.floor(Math.random() * 9);
    }
    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);
    return (formatted ? format(numbers) : numbers);
};
var cpf = {
    verifierDigit,
    strip,
    format,
    isValid,
    generate,
};

const BLACKLIST$1 = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999'
];
const STRICT_STRIP_REGEX$1 = /[-\\/.]/g;
const LOOSE_STRIP_REGEX$1 = /[^\d]/g;
const verifierDigit$1 = (digits) => {
    let index = 2;
    const reverse = digits.split('').reduce((buffer, number) => {
        return [parseInt(number, 10)].concat(buffer);
    }, []);
    const sum = reverse.reduce((buffer, number) => {
        buffer += number * index;
        index = (index === 9 ? 2 : index + 1);
        return buffer;
    }, 0);
    const mod = sum % 11;
    return (mod < 2 ? 0 : 11 - mod);
};
const strip$1 = (number, strict) => {
    const regex = strict ? STRICT_STRIP_REGEX$1 : LOOSE_STRIP_REGEX$1;
    return (number || '').replace(regex, '');
};
const format$1 = (number) => {
    return strip$1(number).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};
const isValid$1 = (number, strict) => {
    const stripped = strip$1(number, strict);
    if (!stripped) {
        return false;
    }
    if (stripped.length !== 14) {
        return false;
    }
    if (BLACKLIST$1.includes(stripped)) {
        return false;
    }
    let numbers = stripped.substr(0, 12);
    numbers += verifierDigit$1(numbers);
    numbers += verifierDigit$1(numbers);
    return numbers.substr(-2) === stripped.substr(-2);
};
const generate$1 = (formatted) => {
    let numbers = '';
    for (let i = 0; i < 12; i += 1) {
        numbers += Math.floor(Math.random() * 9);
    }
    numbers += verifierDigit$1(numbers);
    numbers += verifierDigit$1(numbers);
    return (formatted ? format$1(numbers) : numbers);
};
var cnpj = {
    verifierDigit: verifierDigit$1,
    strip: strip$1,
    format: format$1,
    isValid: isValid$1,
    generate: generate$1
};

const joi = new Proxy(Joi, {
    get(o, name) {
        return o[name].bind(o);
    }
});
const { extend, string } = joi;
var index = extend({
    base: string(),
    name: 'document',
    language: {
        cnpj: 'informado é inválido',
        cpf: 'informado é inválido'
    },
    rules: [{
            name: 'cnpj',
            validate(_params, value, state, options) {
                if (!cnpj.isValid(value)) {
                    return this.createError('document.cnpj', { v: value }, state, options);
                }
                return value;
            }
        }, {
            name: 'cpf',
            validate(_params, value, state, options) {
                if (!cpf.isValid(value)) {
                    return this.createError('document.cpf', { v: value }, state, options);
                }
                return value;
            }
        }]
});

exports.cpf = cpf;
exports.cnpj = cnpj;
exports.default = index;
