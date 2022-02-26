const client = require('./client');

const { attachActivitiesToRoutines } = require('./activities')

const createRoutine = async({creatorId, isPublic, name, goal})=>{

    try{
        const {rows: [routine]} = await client.query(`
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [creatorId, isPublic, name, goal]);
        return routine;
    }catch(error){
        throw error;
    }
}

const getRoutineById = async(id)=>{

    try{
        const {rows: [routines]} = await client.query(`
        SELECT * 
        FROM routines
        WHERE id = $1
        `, [id]);

        return routines;
    }catch(error){
        throw error;
    }
}

const getRoutinesWithoutActivities = async()=>{

    try{
        const {rows: routines} = await client.query(`
        SELECT * FROM routines
        `);
        return routines;
    }catch(error){
        throw error;
    }
}

async function getAllRoutines() {
    try {
      const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
      `);
      return attachActivitiesToRoutines(routines);
    } catch (error) {
      throw error
    }
  }

const getAllPublicRoutines = async()=>{

    try{
        const {rows: routine} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines, users
        WHERE "isPublic" = true;
        `);
        return attachActivitiesToRoutines(routine);
    }catch(error){
        throw error;
    }
}

const  getAllRoutinesByUser = async ()=>{

    try{
        const {rows: routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines, users
        WHERE "isPublic" = true;
        `);
        
        return attachActivitiesToRoutines(routines);
    }catch(error){
        throw error;
    }
}

const  getPublicRoutinesByUser = async ()=> {
    try{
        const {rows: routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines, users
        WHERE "isPublic" = true;
        `);
        
        return attachActivitiesToRoutines(routines);
    }catch(error){
        throw error;
    }
}

const  getPublicRoutinesByActivity = async ()=>{

    try{
        const {rows: activity} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines, users
        WHERE "isPublic" = true;
        `);
        
        return attachActivitiesToRoutines(activity);
    }catch(error){
        throw error;
    }
}

const updateRoutine = async ({ id, ...fields }) => {
   
    const setString = Object.keys(fields).map(
      (key, index) => `"${key}" = $${index + 1}`
    ).join(', ');
  
    if (setString.length === 0) {
      return;
    }
    const valuesArray = [...Object.values(fields), id];
  
    try {
      const { rows: [updatedRoutine] } = await client.query(`
        UPDATE routines
        SET ${setString}
        WHERE id = $${valuesArray.length}
        RETURNING *;
      `, valuesArray)
  
      return updatedRoutine;
    } catch (err) {
      throw err;
    }
  }
const destroyRoutine = async(id) =>{
    try{

        await client.query(`
            DELETE FROM routine_activities 
            WHERE "routineId" = $1
        `, [id])

        const {rows: [routine]} = await client.query(`
            DELETE FROM routines
            WHERE id = $1
            RETURNING *;
        `, [id]);

        return routine;

    }catch(error){
        throw error;
    }
}

module.exports ={ createRoutine, 
    getRoutinesWithoutActivities, 
    getAllRoutines,
    getRoutineById,
    getPublicRoutinesByActivity,
    getAllRoutinesByUser,
    getAllPublicRoutines,
    getPublicRoutinesByUser,
    updateRoutine,
    destroyRoutine
}