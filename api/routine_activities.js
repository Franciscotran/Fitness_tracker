const express = require('express')
const routine_ActivitiesRouter = express.Router()
const {
  updateRoutineActivity, getRoutineActivityById,
  getRoutineById, destroyRoutineActivity,
} = require('../db')
const { requireUser } = require('./utils')


routine_ActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {

      const { routineActivityId: id } = req.params
      const { count, duration } = req.body
      const updateFields = { id }

      if (count) {
        updateFields.count = count
      }
      if (duration) {
        updateFields.duration = duration
      }

      try {
        const routActivity = await getRoutineActivityById(id)
        if (!routActivity)
          throw {
            name: `RoutineActivityIdError`,
            message: `id provided does not match with any existing routine_activity`,
          }
        const routine = await getRoutineById(routActivity.routineId)
        if (req.user.id === routine.creatorId) {
          const newRouteActivity = await updateRoutineActivity(updateFields)
          res.send(newRouteActivity)
        } else {
          next({
            name: `AuthorizationError`,
            message: `User must be the owner to update`,
          })
        }
      } catch (error) {
        next(error)
      }
    });



    routine_ActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
        const { routineActivityId } = req.params;
      
        try {
          const { routineId } = await getRoutineActivityById(routineActivityId);
          const routine = await getRoutineById(routineId);
          if (req.user.id !== routine.creatorId) {
            next({
              name: "InvalidUser",
              message: "You are not the owner of this routine"
            });
            return;
          }
          const destroyedRoutine = await destroyRoutineActivity(routineActivityId)
      
          res.send(destroyedRoutine)
        } catch ({ name, message }) {
          next({ name, message });
        }
      });
      
  


  









module.exports = routine_ActivitiesRouter