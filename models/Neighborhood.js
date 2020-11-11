const database = require('../services/database');

// example queries:
// localhost:5000/api/properties
// localhost:5000/api/properties?zid=4&ncode=6



async function find(context) {

    // Final array concatenates SELECT of each neighborhood
    let final = [];
    // Store selection and math operation choices
    const math = context.math;
    const selection = context.selection;
    let choice;
    if (selection === "iv")
        choice = "improvement_value";
    else if (selection === "lv")
        choice = "land_value";
    else if (selection == "tl")
        choice = "tax_levy";

    for (i = 1; i < 23; i++) {
        const baseQuery =
            `SELECT 
            ROUND(${math}(${selection}_2008), 0) "${selection}_2008_${i}",
            ROUND(${math}(${selection}_2007), 0) "${selection}_2007_${i}",
            ROUND(${math}(${selection}_2009), 0) "${selection}_2009_${i}",
            ROUND(${math}(${selection}_2010), 0) "${selection}_2010_${i}",
            ROUND(${math}(${selection}_2011), 0) "${selection}_2011_${i}",
            ROUND(${math}(${selection}_2012), 0) "${selection}_2012_${i}",
            ROUND(${math}(${selection}_2006), 0) "${selection}_2006_${i}",
            ROUND(${math}(${selection}_2013), 0) "${selection}_2013_${i}",
            ROUND(${math}(${selection}_2014), 0) "${selection}_2014_${i}",
            ROUND(${math}(${selection}_2015), 0) "${selection}_2015_${i}",
            ROUND(${math}(${selection}_2016), 0) "${selection}_2016_${i}",
            ROUND(${math}(${selection}_2017), 0) "${selection}_2017_${i}",
            ROUND(${math}(${selection}_2018), 0) "${selection}_2018_${i}",
            ROUND(${math}(${selection}_2019), 0) "${selection}_2019_${i}",
            ROUND(${math}(${selection}_2020), 0) "${selection}_2020_${i}"
            FROM ${choice} x
            JOIN property p ON x.pid = p.pid
            WHERE p.ncode = ${i}`;

        const result = await database.simpleExecute(baseQuery);
        final = final.concat(result.rows);
        
    }
    
    return final;
    
}

module.exports.find = find;