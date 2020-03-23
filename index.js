'use strict'
const env = require('env')
const getControl = require('./controller/controller')
const funcoes = require('./config/funcoes')
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const Session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const Scene = require('telegraf/scenes/base')
const WizardScene = require('telegraf/scenes/wizard')
const moment = require('moment')
const schedule = require('node-schedule')
const Fs = require('fs')
const Promise = require('promise');
const Axios = require('axios')
const cheerio = require('cheerio')
const Path = require('path')

const { enter, leave } = Stage

const bot = new Telegraf(env.token)

async function downloadBDCorona() {
    const url = 'https://alerta-corona-backend.herokuapp.com/markers'
    const path = Path.resolve(__dirname, 'bd', 'database.json')
    const writer = Fs.createWriteStream(path)

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}



schedule.scheduleJob('* * 0-23 * *', function () {
  //  downloadBDCorona()
})

schedule.scheduleJob('* 5 0-23 * *', function () {
//    renomearBanco()
//      getControl.limpaContagio()
})
//getControl.limpaContagio()

let corona = []
corona.push(banco['brazil'])

let res = []
let dtres = []
var cont = 0
corona.forEach(function (item) {
    var brasil = item
    brasil.forEach(function (res) {
        var uid = res.uid
        var casos = res.cases
        var suspeitos = res.suspects
        var descartados = res.refuses
        var obitos = res.deaths
        var comentarios = res.comments
        const dataArquivo = res.datetime.substring(0, 10).trim()
        const horaArquivo = res.datetime.substring(11, 16).trim()
       //  getControl.insereCorona(moment(dataArquivo, "YYYY-MM-DD").format("YYYY-MM-DD"), horaArquivo, 'Brasil', verificar(uid), verificar(casos), verificar(suspeitos), verificar(descartados), verificar(obitos), verificar(comentarios))
       // console.log(res.uf, moment(dataArquivo, "YYYY-MM-DD").format("YYYY-MM-DD"), horaArquivo, 'Brasil', verificar(uid), verificar(casos), verificar(suspeitos), verificar(descartados), verificar(obitos), verificar(comentarios))
 
    })
})

function verificar(texto) {
    if (typeof texto === 'undefined') {
        return 0
    }
    return texto
}

const desenvolvedor = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Situacao por Estado', 'corona'),
    Markup.callbackButton('Sintomas', 'sintomas'),
    Markup.callbackButton('Prevenção', 'prevencao'),
    Markup.urlButton(`Contato Desenvolvedor`, 'http://t.me/Eduardo_dos_Santos')
], { columns: 2 }
))

const verificarUsuarioTeste = (ctx, next) => {
    const from = ctx.update.message.from
    const nome = from.first_name
    const iduser = from.id
    const idDesenvolvedor = '36009809'
    getControl.insereUserTel(nome, iduser)
    ctx.reply(`
Seja bem vindo, ${nome}!\n 
Bot Informativo sobre casos da COVID-19 no Brasil
Dados obtidos na Plataforma do Ministério da Saúde\n`, desenvolvedor)
}


bot.start(verificarUsuarioTeste, async ctx => {
 

})


const coronaScene = new Scene('corona')
coronaScene.enter(async ctx => {
    let lista = []
    const gerarBotoes = () => Extra.markup(
        Markup.inlineKeyboard(
            lista.map(item => Markup.callbackButton(item, `add ${item}`)),
            { columns: 6 }
        )
    )

    getControl.consultaUF().then((rows) => {
        rows.map((rows) => {
            lista.push(rows.uf)
        })
        ctx.replyWithHTML(`Escolha um Estado`, gerarBotoes())
    }).catch((err) => {
        console.log(err)
    })
})

coronaScene.action(/add (.+)/, async ctx => {
    const uf = ctx.match[1]
    getControl.consultaUltimo().then((row) => {
        var dataConsulta = moment(row[0].dataConsulta, "YYYY-MM-DD").format("YYYY-MM-DD")
        var horaConsulta = row[0].horaConsulta
        getControl.consultaCorona(dataConsulta, horaConsulta, uf).then((row) => {
            console.log(row[0].uf, row[0].casos, row[0].suspeitos, row[0].descartados, row[0].obitos, row[0].comentarios)
            ctx.replyWithHTML(`Estado: ${row[0].estados}\n
            Casos: ${row[0].casos}\n
            Suspeitos: ${row[0].suspeitos}\n
            Descartados: ${row[0].descartados}\n
            Obitos: ${row[0].obitos}\n
            Comentários: ${row[0].comentarios}`)
        })
    })
})
/*
coronaScene.leave(ctx => ctx.replyWithHTML(`Escolha uma opção`, desenvolvedor))
coronaScene.command('cancelar', leave())
*/

bot.action('sintomas', async ctx => {
    ctx.replyWithHTML(`<b>Alguns Sintomas pesquisados</b>`)
    getControl.consultaSintomas('sintomas').then((rows) => {
        rows.map((rows) => {
            ctx.replyWithHTML(`${rows.sintomas}`)
        })   
        
    })
})

bot.action('prevencao', async ctx => {
    ctx.replyWithHTML(`<b>Prevenções</b>`)
    getControl.consultaPrevencao('prevencao').then((rows) => {
        rows.map((rows) => {
            ctx.replyWithHTML(`${rows.prevencao}`)
        }) 
    })
})

const stage = new Stage([coronaScene])

bot.use(Session())
bot.use(stage.middleware())
bot.action('corona', enter('corona'))
bot.startPolling()
