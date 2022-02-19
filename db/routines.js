const client = require('./client');



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


module.exports ={ createRoutine, getRoutinesWithoutActivities}