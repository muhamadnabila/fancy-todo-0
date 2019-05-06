const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    title : String,
    description : String,
    status : Boolean ,
    dueDate : String ,
    userId : {type: Schema.Types.ObjectId, ref: 'User'}
})
const Todo = mongoose.model('Todo',todoSchema)
module.exports = Todo