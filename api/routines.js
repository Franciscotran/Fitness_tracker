const express = require('express')

const routinesRouter = express.Router()
const {
  getAllPublicRoutines,
  getRoutineById,updateRoutine,createRoutine,
  destroyRoutine,addActivityToRoutine,
} = require('../db')
const { requireUser } = require('./utils')



  routinesRouter.get('/', async (req, res, next) => {
    try {
      const routine = await getAllPublicRoutines()
      res.send(routine)
    } catch (error) {
      next(error)
    }
  })




  routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body
    const { id } = req.user
    try {
      const newRoutine = await createRoutine({
        creatorId: id,
        isPublic,
        name,
        goal,
      })
      res.send(newRoutine)
    } catch (err) {}
  })
  

  routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId: id } = req.params;
    const updateData = { id, ...req.body };
    
    try {
      const { creatorId } = await getRoutineById(id);
      if (req.user.id !== creatorId) {
        next({
          name: "InvalidUserError",
          message: "You are not the owner of this routine"
        });
      }
  
      const updatedRoutine = await updateRoutine(updateData);
  
      res.send(updatedRoutine);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const { routineId: id } = req.params
    try {
      const routine = await getRoutineById(id)
  
      if (!routine)
        next({
          name: `RoutineByIdError`,
          message: `id provided does not match with any existing routine`,
        })
  
      if (routine.creatorId === req.user.id) {
        const deleteRoutine = await destroyRoutine(id)
        res.send(deleteRoutine)
      }
    } catch (error) {
      next(error)
    }
  })

  routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    const { routineId } = req.params;
    const activityRoutine = { ...req.body, routineId}
    
    try {
      const routineActivityPair = await addActivityToRoutine(activityRoutine);
  
      res.send(routineActivityPair)
    } catch ({ name, message }) {
      next({ name, message });
    }
  })




module.exports = routinesRouter