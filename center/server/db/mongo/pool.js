let dbSchemas = require('./dbschemas');
const pool = new Map();

let getMongoPool = (dbname)=>{
    dbname = "tollstation";

    if(!pool.has(dbname)){
        let schemas = new dbSchemas();
        pool.set(dbname, schemas);
    }
    let db = pool.get(dbname);
    return db;
}

module.exports = getMongoPool;