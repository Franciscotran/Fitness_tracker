const client = require('./client');


const createUser = async({username,password})=>{

    try{
        const {rows: [users]} = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password]);
        return users;
    }catch(error){
        throw error;
    }
}

module.exports ={ createUser}