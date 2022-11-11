const { Sequelize } = require('sequelize')

const conn = new Sequelize('DATABASE', 'USER', 'PASSWORD', {
    host: 'HOST',
    dialect: 'mysql'
})

try {
    conn.authenticate()
    console.log('Conectado com sucesso!')
} catch (error) {
    console.log(`Erro: ${error}`);
}

module.exports = conn