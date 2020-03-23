'use strict'
const env = require('./.env')
const getControl = require('./controller/controller')
const funcoes = require('./config/funcoes')
const banco = require('./bd/markers')
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
const emoji = require('node-emoji')
const Axios = require('axios')
const cheerio = require('cheerio')
const Path = require('path')

const { enter, leave } = Stage

const bot = new Telegraf(env.token)

//console.log(emoji.get(':x:'))



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

schedule.scheduleJob('30 5 0-23 * *', function () {

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
   

    bot.telegram.sendMessage(idDesenvolvedor, `${nome} - ${iduser}`)
    next()
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



/* Plataforma saude coronavirus

async function downloadBDCorona() {
    const url = 'http://plataforma.saude.gov.br/novocoronavirus/resources/scripts/database.js'
    const path = Path.resolve(__dirname, 'bd', 'databaseSite.js')
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

async function renomearBanco() {
    Fs.readFile('./bd/databaseSite.js', 'utf-8', function (err, data) {
        if (err) throw err
        //console.log(data.replace('var database=',''))
        Fs.writeFile('./bd/database.json', data.replace('var database=', ''), function (err) {
            if (err) throw err;
            console.log('Arquivo salvo!');
        })
    })
}


schedule.scheduleJob('* * 0-23 * *', function () {
    downloadBDCorona()
})

schedule.scheduleJob('* 5 0-23 * *', function () {
    renomearBanco()
    //  getControl.limpaContagio()
})

schedule.scheduleJob('30 5 0-23 * *', function () {


})



let corona = []
    corona.push(banco['brazil'])

    let res = []
    let dtres = []
    corona.forEach(function (item) {
        var brasil = item
        brasil.forEach(function (itens) {
            var estados = itens.values
            console.log(estados)
            estados.forEach(function (res) {
                var uid = res.uid
                var casos = res.cases
                var suspeitos = res.suspects
                var descartados = res.refuses
                var obitos = res.deaths
                var comentarios = res.comments
                const dataArquivo = itens.date
                const horaArquivo = itens.time
               getControl.insereCorona(moment(itens.date, "DD/MM/YYYY").format("YYYY-MM-DD"), horaArquivo, 'Brasil', verificar(uid), verificar(casos), verificar(suspeitos), verificar(descartados), verificar(obitos), verificar(comentarios))
                console.log(moment(itens.date, "DD/MM/YYYY").format("YYYY-MM-DD"), horaArquivo, 'Brasil', verificar(uid), verificar(casos), verificar(suspeitos), verificar(descartados), verificar(obitos), verificar(comentarios))
            })
        })
    })


    fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(response => response.json())
  .then(data => {
    data["Argentina"].forEach(({ date, confirmed, recovered, deaths }) =>
      console.log(`${date} active cases: ${confirmed - recovered - deaths}`)
    )
  })
    */