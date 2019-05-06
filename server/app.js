require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes')
const mongoose = require('mongoose')
const port = 3000
const cors = require('cors') 
mongoose.connect('mongodb://localhost:27017/fancyTodo', {useNewUrlParser: true});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/',routes)

app.listen(port,()=>{ console.log (`app running on port`,port)})