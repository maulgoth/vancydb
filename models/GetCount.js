const database = require("../services/database");

// example queries:
// localhost:5000/api/neighborhoods
// localhost:5000/api/neighborhoods?selection=lv&math=avg

async function find(context) {
    let final = [];
    let query = `SELECT 
        count(p.pid), count(line_1) FROM
        property p, narrative_legal, address
        
        `;

    const result = await database.simpleExecute(query);
    return result.rows;
}

module.exports.find = find;
