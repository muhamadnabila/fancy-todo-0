const {OAuth2Client} = require('google-auth-library');
const { User }  = require('../models')
const { hash } = require('../helpers/bcrypt')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')

class ControllerUser {

 static register(req, res) {
    let { username, email, password } = req.body
    let hashed =  hash(password) 
    let newUser = {
      username, 
      email,
      password: hashed,
    }
    User.create(newUser)
    .then(data => {
      let payload = {
        id: data._id,
        username : data.username,
        email : data.email
      }
      let access_token = sign(payload)
        res.status(201).json(access_token)
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findAll(req, res) {
    User.find()
      .populate('todos')
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findOne(req, res) {
    User.findOne({ _id: req.params.id })
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => { res.status(500).json({ message: err.message }) })
  }
  static update(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static delete(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then(user => {
        const response = {
          message: 'Successfully deleted user.',
          id: req.params.id
        }
        res.status(200).json(response)
      })
      .catch(err => { res.status(500).json({ message: err.message }) })
  }

  static login(req, res) {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          res.status(401).json({ message: 'user tidak ada/ password salah' })
        } else {
          if (!compare(req.body.password, user.password)) {
            res.status(401).json({ message: 'user tidak ada/ password salah' })
          } else if (compare(req.body.password, user.password) || req.body.password == user.password) {
            let obj = {
              name: user.name,
              email: user.email,
              id: user._id
            }
            let access_token = sign(obj)
            res.status(201).json({ 
              access_token,
              username: user.username,
              email: user.email,
              id: user._id
             })
          }
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
  static loginGoogle(req,res) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
     client
      .verifyIdToken({
          idToken: req.headers.id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket=>{
          const payload = ticket.getPayload();
        User.findOne({ email: payload.email })
          .then(user => {
            if (!user) {
              return User.create({
                email: payload.email,
                username: payload.name,
                password: ''
              })	

            } else {
              return user
            }
          })
          .then(user => {
            const access_token = sign({
              username: user.name,
              email: user.email
            })
            res.status(200).json({ access_token })
          })
          .catch(err => {
            res.status(500).json({ err: err.message })
          })
        })
        .catch(err=>{
        })
    }
}

module.exports = ControllerUser