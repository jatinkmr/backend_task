const { Sequelize, DataTypes } = require('sequelize')

const dbName = 'squareboattask'
const dbUserName = 'root'
const passWord = 'Jatin1996'

const sequelize = new Sequelize(dbName, dbUserName, passWord, {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log('SQL Database Connected!!')
}).catch((error) => {
    console.log('index authenticate error => ', error)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.candidate = require('./Candidate/Candidate')(sequelize, DataTypes)
db.recruiter = require('./Recruiter/Recruiter')(sequelize, DataTypes)
db.jobpost = require('./JobPost/JobPost')(sequelize, DataTypes)
db.jobapplication = require('./JobApplication/JobApplication')(sequelize, DataTypes)

db.sequelize.sync().then(() => {
    console.log('DataBase Synced!!')
}).catch((error) => {
    console.log('sync error => ', error)
})

module.exports = db