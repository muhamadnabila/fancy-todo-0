const  moment = require('moment')
const { Todo } = require('../models')
const { User } = require('../models')

class ControllerTodo {
  static create(req, res) {
    let input = req.body
    let newTodo = {
      title: input.title,
      description : input.description,
      dueDate : input.dueDate,
      userId: req.user.id,
      status: false
    }
    Todo.create(newTodo)
      .then(data => {
        return User.findOneAndUpdate({ _id: req.user._id }, { $push: { todos: data }}, { new: true })
      })
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findAll(req, res) {
    Todo.find({userId : req.user._id})
      .then(data => {
        let newData = []
        let momentCheck ;
        data.forEach((el,i) =>{ 
          momentCheck = moment(data[i].dueDate.split('/').join('')).fromNow()
          newData.push({
            data : data[i],
            momentCheck : momentCheck
          })
        })
        res.status(200).json(newData)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static findOne(req, res) {
    Todo.findOne({_id: req.params.id})
      .populate('userId')
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static update(req, res) {
    // req.body.checked = (req.body.checked === 'true' || req.body.checked === true) ? true : false
    Todo.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
    .then(todo => {
      console.log(todo)
      res.status(200).json(todo)
    })
    .catch(err => res.status(500).json({message: err.message}))
  }

  static delete(req, res) {
    User.findOneAndUpdate({ _id: req.user._id }, { $pull : { todos: req.params.id}} ,{ new: true })
      .then(user => {
        return Todo.findOneAndDelete({_id: req.params.id})
      })
      .then(todo => {
        const response = {
          message: 'Successfully deleted todo.',
          id: req.params.id,
          userId :  todo.userId
        }
        res.status(200).json(response)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
}

module.exports = ControllerTodo