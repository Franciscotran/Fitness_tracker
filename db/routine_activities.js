const client = require('./client');


const addActivityToRoutine = async({routineId, activityId, count, duration})=>{

    try{
        const {rows: [routine_activity]} = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,[routineId, activityId, count, duration])

        return routine_activity

    }catch(error){
        throw error;
   }
}

const destroyRoutineActivity = async({id}) =>{
    try{
        const {rows: [routine_activity]} = await client.query(`
            DELETE FROM routine_activities
            WHERE id = $1
            RETURNING *;
        `, [id])
        return routine_activity;
    }catch(error){
        throw error;
    }
}

const getRoutineActivitiesByRoutine = async({id}) =>{
    try{
        const {rows: [routine_activity]} = await client.query(`
            SELECT routine_activity.*
            FROM routine_activities
            WHERE "routineId" = ${id}
        `)
        return routine_activity
    }catch(error){
        throw error;
    }
}


module.exports ={ addActivityToRoutine,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
}