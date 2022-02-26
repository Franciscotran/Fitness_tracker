// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express')
const apiRouter = express.Router()
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const healthRouter = express.Router()


apiRouter.use('/health', require('./health'))
apiRouter.use('/users', require('./users'))


apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message,
    })
  })



module.exports = apiRouter;