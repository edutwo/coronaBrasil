const mySql = require('mysql2')

const connCoro = mySql.createPool ({
    connectionLimit : 30,
    host            : '192.168.254.250',
    database        : 'coronaVirus',
    user            : 'root',
    password        : 'santoedu',
    charset         : `UTF8MB4_GENERAL_CI`
})

const connTel = mySql.createPool ({
    connectionLimit : 30,
    host            : '192.168.254.250',
    database        : 'baseTelegram',
    user            : 'root',
    password        : 'santoedu',
    charset         : `UTF8MB4_GENERAL_CI`
})




module.exports = {connCoro, connTel}

