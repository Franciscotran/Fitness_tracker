const client = require('./client');

const bcrypt = require('bcrypt');
const saltRounds = 10;


const createUser = async({username,password})=>{

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    try{
        const {rows: [users]} = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, hashedPassword ]);
        delete users.password;
        return users;
    }catch(error){
        throw error;
    }
}


const getUserByUsername = async (username)=>{

    try{
        const {rows: [user]} = await client.query(`
        SELECT * FROM users
        WHERE username = $1
        `, [username]);
      return user;
    }catch(error){
        throw error;
    }


}

const getUserById = async (id)=>{

    try{
        const {rows: user} = await client.query(`
        SELECT * FROM users
        WHERE id = $1
        `, [id]);
        delete user.password;
      return user;
    }catch(error){
        throw error;
    }


}


const getUser = async({username, password})=>{
    if (!username || !password) {
        return;
      }
    
      try {
        const user = await getUserByUsername(username);
        if(!user) return;
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);
        if(!passwordsMatch) return;
        delete user.password;
        return user;
      } catch (error) {
        throw error;
      }
  
}


module.exports ={ createUser, getUser, getUserById}