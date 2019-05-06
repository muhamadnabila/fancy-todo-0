const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    title: {
        type: String,
        required: [true, `Title required.`],
      },
    description : {
        type: String,
        required: [true, `Description required.`],
      },
    status : Boolean ,
    dueDate :{
        type: String,
        required: [true, `dueDate required.`],
      }, 
    userId : {type: Schema.Types.ObjectId, ref: 'User'}
})
const Todo = mongoose.model('Todo',todoSchema)
module.exports = Todo