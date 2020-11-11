const database = require('../services/database');

// example queries:
// localhost:5000/api/properties
// localhost:5000/api/properties?zid=4&ncode=6



async function avg(context) {

    let final = [];
    const selection = context.selection;

    console.log(selection);

    let choice;
    if (selection === "iv")
        choice = "improvement_value";
    else if (selection === "lv")
        choice = "land_value";
    else if (selection == "tl")
        choice = "tax_levy";

    console.log(choice);

    for (i = 1; i < 23; i++) {
        const baseQuery =
            `SELECT 
            ROUND(AVG(${selection}_2007), 0) "${selection}_2007_${i}",
            ROUND(AVG(${selection}_2008), 0) "${selection}_2008_${i}",
            ROUND(AVG(${selection}_2009), 0) "${selection}_2009_${i}",
            ROUND(AVG(${selection}_2010), 0) "${selection}_2010_${i}",
            ROUND(AVG(${selection}_2011), 0) "${selection}_2011_${i}",
            ROUND(AVG(${selection}_2012), 0) "${selection}_2012_${i}",
            ROUND(AVG(${selection}_2006), 0) "${selection}_2006_${i}",
            ROUND(AVG(${selection}_2013), 0) "${selection}_2013_${i}",
            ROUND(AVG(${selection}_2014), 0) "${selection}_2014_${i}",
            ROUND(AVG(${selection}_2015), 0) "${selection}_2015_${i}",
            ROUND(AVG(${selection}_2016), 0) "${selection}_2016_${i}",
            ROUND(AVG(${selection}_2017), 0) "${selection}_2017_${i}",
            ROUND(AVG(${selection}_2018), 0) "${selection}_2018_${i}",
            ROUND(AVG(${selection}_2019), 0) "${selection}_2019_${i}",
            ROUND(AVG(${selection}_2020), 0) "${selection}_2020_${i}"
            FROM ${choice} x
            JOIN property p ON x.pid = p.pid
            WHERE p.ncode = ${i}`;

        const result = await database.simpleExecute(baseQuery);
        final = final.concat(result.rows);
        
    }
    
    return final;
    
}

module.exports.avg = avg;