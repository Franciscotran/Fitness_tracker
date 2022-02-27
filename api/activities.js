const express = require('express')
const activitiesRouter = express.Router()
const  {requireUser}  = require('./utils')
const {
  getAllActivities,createActivity,getActivityById,
  updateActivity,getPublicRoutinesByActivity,
} = require('../db')

activitiesRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities()
    res.send(activities)
  } catch (error) {
    next(error)
  }
})

activitiesRouter.post('/', requireUser, async (req, res, next) => {
   
    const postData = {}
    try {
      const { name, description } = req.body
      if (!name || !description) {
        next({
          name: 'IncompleateFormatError',
          message: 'Requires a username and description',
        })
        return
      }
      postData.name = name;
      postData.description =description;
      
      const newActivity = await createActivity(postData)
      res.send(newActivity)
    } catch (error) {
      next(error)
    }
  })


  activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId: id } = req.params;
    const {name, description} = req.body
  
    try {
      const updatedActivity = await updateActivity(id, name, description);
  
      res.send(updatedActivity)
    } catch ({ name, message }) {
      next({ name, message });
    }
  })



activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const { activityId: id } = req.params
    try {
      const activity = await getActivityById(id)
      const routineActivities = await getPublicRoutinesByActivity(activity)
      res.send(routineActivities)
    } catch (error) {
      next(error)
    }
  })






module.exports = activitiesRouter