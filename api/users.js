const express = require('express')
const usersRouter = express.Router()
const { createUser, getUser, getUserById, getUserByUsername} = require('../db')
const jwt = require('jsonwebtoken')

usersRouter.use((req, res, next) => {
    // console.log('A request is being made to /users')
  
    next()
})


usersRouter.post('/register', async (req, res, next) => {

    const { username, password } =  req.body
    console.log("this is username", username)
    try {
      const _user = await getUser(username)
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'This username already exists',
        })
      }
  
      const user = await createUser({ "username" : username
        ,"password": password })
  
      const token = jwt.sign(
        {
          id: user.id,
          username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1w',
        }
      )
  
      res.send({
        message: 'Thank you for signing up!!!',
        token
      });
    } catch ({ name, message }) {
      next({ name, message })
    }
})
  
module.exports = usersRouter;