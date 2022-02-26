const client = require('./client');


const addActivityToRoutine = async({routineId, activityId, count, duration})=>{

    try{
        const {rows: [routineActivity]} = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,[routineId, activityId, count, duration])

        return routineActivity

    }catch(error){
        throw error;
   }
}



const getRoutineActivitiesByRoutine = async({id}) =>{
    try{
        const {rows }= await client.query(`
            SELECT *
            FROM routine_activities
            WHERE "routineId" = ${id}
        `)
        return rows
    }catch(error){
        throw error;
    }
}

const updateRoutineActivity = async (routineObj = {}) => {
    try {
      const setString = Object.keys(routineObj)
        .map((key, idx) => `"${key}"=$${idx + 1}`)
        .join(', ')
  
      if (setString.length === 0) return
  
      const { rows: [updatedRoutineActivity],
      } = await client.query(
        `
          UPDATE routine_activities
          SET ${setString}
          WHERE id = ${routineObj.id}
          RETURNING *;
        `,
        Object.values(routineObj)
      )
  
      return updatedRoutineActivity
    } catch (err) {
      throw err
    }
  }


  const getRoutineActivityById = async (id) => {
    try {
      const { rows: [routineActivity]} = await client.query(
        `
        SELECT *
        FROM routine_activities
        WHERE id = $1;
      `,
        [id]
      )
  
      return routineActivity
    } catch (err) {
      throw err
    }
  }

//   "activityId" INTEGER REFERENCES activities(id),
//   "routineId" INTEGER REFERENCES  routines(id),

    const destroyRoutineActivity = async(id) =>{

        try{
            const {rows: [routineActivity]} = await client.query(`
                DELETE FROM routine_activities
                WHERE "id" = $1
                RETURNING *;
            `, [id])

            return routineActivity
        }catch(error){
            throw error;
        }
    }

  

module.exports ={ addActivityToRoutine,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine,
    updateRoutineActivity,
    getRoutineActivityById 
}