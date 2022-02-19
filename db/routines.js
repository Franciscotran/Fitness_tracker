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

const getAllRoutines = async()=>{

    try{
        const {rows: routines} = await client.query(`
        SELECT id 
        FROM routines

        `);
        const allRoutines = await Promise.all(routines.map(routine => getRoutineById(routine.id)))
        return allRoutines;
    }catch(error){
        throw error;
    }
}

const getAllPublicRoutines = async()=>{

    try{
        const {rows: routine} = await client.query(`
        SELECT *
        FROM routines
        WHERE "isPublic" = true;
        `);
        return routine;
    }catch(error){
        throw error;
    }
}

const  getAllRoutinesByUser = async (id)=>{

    try{
        const {rows: [routine]} = await client.query(`
        SELECT * 
        FROM routines
        WHERE id = $1
        `, [id]);
        
      return routine;
    }catch(error){
        throw error;
    }
}

const  getPublicRoutinesByUser = async (id)=> {

}

const  getPublicRoutinesByActivity = async (id)=>{

    try{
        const {rows: [activity]} = await client.query(`
        SELECT * 
        FROM activities
        WHERE id = $1
        `, [id]);
        
      return activity;
    }catch(error){
        throw error;
    }
}

const updateRoutine = async()=>{

    try{
        const {rows: [routine]} = await client.query(`
        
        `, );
        return routine;
    }catch(error){
        throw error;
    }
}


module.exports ={ createRoutine, 
    getRoutinesWithoutActivities, 
    getAllRoutines,
    getRoutineById,
    getAllPublicRoutines
}