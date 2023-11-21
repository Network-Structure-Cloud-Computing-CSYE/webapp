const express = require('express')

const userRouter = require('./routes/users-router.js')

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

 
// Getcommand

app.use('/', userRouter)

 

app.use('*', (req, res) => {
    res.status(400).send('Invalid route')
})

 

module.exports = app