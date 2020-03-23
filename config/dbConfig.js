const mySql = require('mysql2')

const connCoro = mySql.createPool ({
    connectionLimit : 30,
    host            : '192.168.254.xx',
    database        : 'coronaVirus',
    user            : 'user',
    password        : 'senha',
    charset         : `UTF8MB4_GENERAL_CI`
})

module.exports = {connCoro}

