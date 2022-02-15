// require and re-export all files in this db directory (users, activities...)
const client = require('./client');



module.exports ={
    ...require('./users'),
    ...require('./activities')
}

