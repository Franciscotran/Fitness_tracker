const client = require('./client');


const addActivityToRoutine = async({routineId, activityId, count, duration})=>{

    try{
        const {rows: [activity_routine]} = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        
        `,[routineId, activityId, count, duration])

        return activity_routine

    }catch(error){
        throw error;
 
   }

}


module.exports ={ addActivityToRoutine}