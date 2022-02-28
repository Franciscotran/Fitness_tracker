const express = require('express')
const usersRouter = express.Router()
const jwt = require('jsonwebtoken')
const { requireUser } = require('./utils')
const { JWT_SECRET } = process.env
const { createUser, getUser, getUserById, getUserByUsername,getPublicRoutinesByUser} = require('../db')

usersRouter.use((req, res, next) => {
    // console.log('A request is being made to /users')
  
    next()
})

//created users/register route
usersRouter.post('/register', async (req, res, next) => {

    const { username, password } =  req.body
    
    try {
      const checkUser = await getUser(username)
  
      if (password.length < 8) {
        next({
          name: `PasswordError`,
          message: 'Password must be 8 characters or more',
        })
        return
      }
      if (checkUser) {
        next({
          name: 'UserExistsError',
          message: 'This username already exists',
        })
        return
      }
      const user = await createUser({ username, password })
      res.send({ user })
    } catch ({ name, message }) {
      next({ name, message })
    }
})

    usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
      next({
        name: 'loginCredentialError',
        message: 'Must provide a valid username and password',
      })
      return
    }
    try {
      const user = await getUser({ username, password })
      if(user){

      
      const token = jwt.sign(user, JWT_SECRET)
      res.send({ token, message: 'Successfully logged In' })
     }else {
        next({
            name: 'Incorrect credentials',
            message: 'Username or password is incorrect'
        })
    }

    } catch (error) {
      next(error)
    }
  })
  

  usersRouter.get('/me', requireUser, async (req, res, next) => {
    try {
      res.send(req.user)
    } catch (err) {
      next(err)
    }
  })

  
  usersRouter.get('/:username/routines', async (req, res, next) => {
    try {
      const { username } = req.params
      const user = await getUserByUsername(username).then((user) => {
        delete user.password
        return user
      })
      const routinesByUser = await getPublicRoutinesByUser(user)
      res.send(routinesByUser)
    } catch (error) {
      next(error)
    }
  })


  
module.exports = usersRouter;