const route = require('express').Router()
const {ControllerUser, ControllerTodo} =  require('../controllers')
const { authenticate, authorize} = require('../middlewares/auth')

route.get('/', (req, res) => {res.status(200).json({message: 'Home Page'})})

route.post('/users',ControllerUser.register)
route.post('/users/login',ControllerUser.login)
route.get('/users', ControllerUser.findAll)
route.get('/users/:id', ControllerUser.findOne)
route.put('/users/:id', ControllerUser.update)
route.delete('/users/:id', ControllerUser.delete)
route.post('/users/login/google',ControllerUser.loginGoogle)

route.post('/todos', authenticate, ControllerTodo.create)
route.get('/todos', authenticate, ControllerTodo.findAll)
route.get('/todos/:id', ControllerTodo.findOne)
route.put('/todos/:id', authenticate, authorize, ControllerTodo.update)
route.delete('/todos/:id', authenticate, authorize, ControllerTodo.delete)


route.use('/*',(req,res)=>{
    res.status(404).json({
        error : 'Not Found'
    })
})

module.exports = route