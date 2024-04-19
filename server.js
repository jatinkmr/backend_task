const express = require('express')
const bodyParser = require('body-parser')

const PORT = 8080 || process.en.PORT
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/api/v1', require('./routes'))

// wrong or non-existing route handler
app.use(function (req, res) {
    res.status(404).send({ url: `No such ${req.originalUrl} url exist. Please try with correct one!!` })
})

// error handler
app.use(function (err, req, res, next) {
    console.log('err in server', err)
    return res.status(500).send({
        error: true,
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`)
})