var Promise = require("promise")
const pool = require('../config/dbConfig')
const iconv = require('iconv-lite')

function limpaContagio() {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = `call limpaContagio()` //procedure mysql envia o status e recebe as informações
        console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}


function consultaData() {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = 'SELECT * FROM contagio ORDER BY idcontagio DESC LIMIT 1' //procedure mysql envia o status e recebe as informações
      //  console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}

function consultaPrevencao(previnir) {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = `call consultaPrevencao('${previnir}')` //procedure mysql envia o status e recebe as informações
        console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}

function consultaSintomas(sintoma) {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = `call consultaSintomas('${sintoma}')` //procedure mysql envia o status e recebe as informações
        console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}

function consultaUF() {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = `call consultaUF()` //procedure mysql envia o status e recebe as informações
        console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}

function consultaCorona(consultaData,consultaHora,uf) {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = `call consultaCorona('${consultaData}','${consultaHora}','${uf}')` //procedure mysql envia o status e recebe as informações
        //console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}

function consultaUltimo() {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = 'call consultaUltimo()' //procedure mysql envia o status e recebe as informações
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}



function insereCorona(dataConsulta, horaConsulta, pais, uid, casos, suespeitos, descartados, obitos, comentarios) {
    return new Promise(fn)
    function fn(resolve, reject) {
        const pool = require('../config/dbConfig')
        var sql = 'INSERT INTO contagio(dataConsulta,horaConsulta,pais,uid,casos,suspeitos,descartados,obitos,comentarios) VALUES ('+`'${dataConsulta}', '${horaConsulta}', '${pais}', '${uid}', '${casos}', '${suespeitos}', '${descartados}', '${obitos}', '${comentarios}'`+')' //procedure mysql envia o status e recebe as informações
      //  console.log(sql)
        pool.connCoro.getConnection(function (err, con) {
            if (err) {
                return reject(err)
            } else {
                con.query(sql, function (err, rows) {
                    if (err) {
                        return reject(err)
                    } else {
                        con.release(); // libera a conexção
                        return resolve(rows[0])
                    }
                })
            }
        })
    }
}


const convertUTF8 = (palavra) => {
    buf = iconv.encode(palavra, 'latin1');
    str = iconv.decode(new Buffer(buf), 'utf8');
    return str
}


function close() {
    return pool.conn.end()
}

module.exports = { insereCorona, 
    consultaData, 
    consultaCorona, 
    consultaUltimo, 
    consultaUF, 
    limpaContagio, 
    consultaSintomas,
    consultaPrevencao,
    close, 
    convertUTF8 }


