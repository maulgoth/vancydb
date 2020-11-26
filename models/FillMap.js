const database = require("../services/database");

// example queries:
// localhost:5000/api/neighborhoods
// localhost:5000/api/neighborhoods?selection=lv&math=avg

async function find(context) {
    let final = [];
    let query = `SELECT 
        ncode "ncode",
        geo_poly_outline "geo_poly_outline"
        FROM NEIGHBORHOODS
        ORDER BY ncode ASC`;

    const result = await database.simpleExecute(query);
    for (i = 0; i < 22; i++) {
        final [i] = result.rows[i];
        let temp = JSON.parse(result.rows[i].geo_poly_outline);
        final[i].geometry = temp;
        final[i].type = 'Feature';
        final[i].properties = {};
        final[i].properties.ncode = result.rows[i].ncode;
    }
    
    return result.rows;
}

module.exports.find = find;
