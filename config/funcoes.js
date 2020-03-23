const getControl = require('../controller/controller')
const Session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const Scene = require('telegraf/scenes/base')
const WizardScene = require('telegraf/scenes/wizard')

function removerAcentos(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

const enviaTelefone = {
  "parse_mode": "Markdown",
  "reply_markup": {
    "one_time_keyboard": true,
    "keyboard": [[{
      text: "Enviar meu Nº telefone",
      request_contact: true
    }], ["Cancel"]]
  }
}

const MenuEntrada = Extra.markup(Markup.inlineKeyboard([
  Markup.callbackButton('Menu', 'menu'),
  Markup.callbackButton('Cadastro', 'cadastro'),
  Markup.urlButton(`Contato`, 'http://t.me/Eduardo_dos_Santos')
]))

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}


function validarCEP(cep) {
  var objER = /^(\d{5})\-?(\d{3})$/
  if (!cep || !objER.test(cep)) {
    return false
  }
  return true
}

module.exports = { removerAcentos, isEmpty, validarCEP, enviaTelefone }