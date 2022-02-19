const client = require('./client');

const createActivity = async({name,description})=>{

    try{
        const {rows: [activity]} = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [name, description]);
        return activity;
    }catch(error){
        throw error;
    }
}

const  getActivityById = async (id)=>{

    try{
        const {rows: [activity]} = await client.query(`
        SELECT * FROM activities
        WHERE id = $1
        `, [id]);
        
      return activity;
    }catch(error){
        throw error;
    }
}


const updateActivity = async (activitytId, fields = {}) =>{

    const { activities } = fields; 
    delete fields.activities;
  
    
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');


    try{
        const {rows: [activity]} = await client.query(`
        UPDATE activities
        SET $1
        WHERE id = $2
        RETURNING *;
        `, [setString, activitytId]);

        if (tags === undefined) {
            return await getPostById(postId);
          }
        return activity;
    }catch(error){
        throw error;
    }
}


const getAllActivities = async()=>{

    try{
        const {rows: activities} = await client.query(`
        SELECT * FROM activities
        `);
        return activities;
    }catch(error){
        throw error;
    }
}


module.exports ={ createActivity, getAllActivities, updateActivity,getActivityById}