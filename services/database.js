const oracledb = require('oracledb');
const dbConfig = require('../config/database');

async function initialize() {
  const pool = await oracledb.createPool(dbConfig.testPool);
}

oracledb.fetchAsString = [ oracledb.CLOB ];

module.exports.initialize = initialize;

// Database Execution, used by oracledb
function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;
  
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
  
    try {
      conn = await oracledb.getConnection(dbConfig.testPool);
  
      const result = await conn.execute(statement, binds, opts);
  
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.simpleExecute = simpleExecute;

// This function comes from Oracle.
// It closes the open OracleDB pool connections before
// terminating the server.
async function close() {
  console.log('Closing database...');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds.
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file.
    // This setting should not be needed if both Oracle Client and Oracle
    // Database are 19c (or later).
    await oracledb.getPool().close(10);
    console.log("Pool closed!");
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports.close = close;