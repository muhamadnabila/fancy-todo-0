require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes')
const mongoose = require('mongoose')
const port = process.env.PORT
const cors = require('cors') 
mongoose.connect('mongodb+srv://root:admin@cluster0-qtp0t.gcp.mongodb.net/fancytodo?retryWrites=true', {useNewUrlParser: true});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/',routes)

app.listen(port,()=>{ console.log (`app running on port`,port)})