const { verify } = require('../helpers/jwt');
const { User, Todo } = require('../models');
const {ObjectId} = require('mongoose').Types
module.exports = {
  authenticate: function(req, res, next) {
    let token = req.headers.token;
    if (!token) {
      res.status(401).json({ error: 'You must login to access this endpoint' });
    } else {
      let decoded = verify(token);
      User
       .findOne({
         email: decoded.email
        })
        .then(user => {
          if(user) {
           req.user = user;
           next();
          } else {
           res.status(401).json({ error: 'User is not valid' });
         }
       })
       .catch(err => { res.status(500).json(err) })
    }
  },
  authorize: function(req, res, next) {
    let todoId = req.params.id
    Todo.findOne({ _id : todoId })
    .then(todo => {
      if(String(todo.userId) === String(req.user._id)) {
          next()
        } else {
          res.status(401).json({ error: 'Unauthorized' })
        }
      })
      .catch(err => { res.status(500).json(err) })
  },
}