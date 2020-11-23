const database = require("../services/database");

// example queries:
// localhost:5000/api/neighborhoods
// localhost:5000/api/neighborhoods?selection=lv&math=avg

async function find(context) {
    let query = `SELECT 
        ncode "ncode",
        geo_poly_outline "geo_poly_outline"
        FROM NEIGHBORHOODS
        ORDER BY ncode ASC`;

    const result = await database.simpleExecute(query);
    return result.rows;
}

module.exports.find = find;
