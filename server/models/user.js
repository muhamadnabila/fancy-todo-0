const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type: String,
        required: [true, `Name required.`],
      },
    email: {
        type: String,
        required: [true, `Email required.`],
      },
    password: {
        type: String,
        required: [true, `Password required.`],
      },
})
User.schema.path('email').validate(function (input) {
    User.findOne({email: input})
      .then(found => {
        if(found) {
          return false
        } else {
          return true
        }
      })
      .catch(err => {console.log(err)})
  }, 'Email has been used.')
  
let User = mongoose.model('User',userSchema)

module.exports = User