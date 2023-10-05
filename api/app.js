const express = require('express')

const userRouter = require('./routes/users-router.js')

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

 


app.use('/', userRouter)

 

app.use('*', (req, res) => {
    res.status(405).send('Method not allowed')
})

 

module.exports = app