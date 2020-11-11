const database = require('../services/database');

// example queries:
// localhost:5000/api/properties
// localhost:5000/api/properties?zid=4&ncode=6

let final;

async function avg(context) {

    for (i = 1; i < 23; i++) {

        const baseQuery;

        if (context.selection === "iv") {
            baseQuery =
                `SELECT 
                ROUND(AVG(IV_2006), 2) "IV_2006_${i}",
                ROUND(AVG(IV_2007), 2) "IV_2007_${i}",
                ROUND(AVG(IV_2008), 2) "IV_2008_${i}",
                ROUND(AVG(IV_2009), 2) "IV_2009_${i}",
                ROUND(AVG(IV_2010), 2) "IV_2010_${i}",
                ROUND(AVG(IV_2011), 2) "IV_2011_${i}",
                ROUND(AVG(IV_2012), 2) "IV_2012_${i}",
                ROUND(AVG(IV_2013), 2) "IV_2013_${i}",
                ROUND(AVG(IV_2014), 2) "IV_2014_${i}",
                ROUND(AVG(IV_2015), 2) "IV_2015_${i}",
                ROUND(AVG(IV_2016), 2) "IV_2016_${i}",
                ROUND(AVG(IV_2017), 2) "IV_2017_${i}",
                ROUND(AVG(IV_2018), 2) "IV_2018_${i}",
                ROUND(AVG(IV_2019), 2) "IV_2019_${i}",
                ROUND(AVG(IV_2020), 2) "IV_2020_${i}"
                FROM improvement_value x
                JOIN property p ON x.pid = p.pid
                WHERE p.ncode = ${i}`;
        }

        else if (context.selection === "lv") {
            baseQuery =
                `SELECT 
                ROUND(AVG(LV_2006), 2) "LV_2006_${i}",
                ROUND(AVG(LV_2007), 2) "LV_2007_${i}",
                ROUND(AVG(LV_2008), 2) "LV_2008_${i}",
                ROUND(AVG(LV_2009), 2) "LV_2009_${i}",
                ROUND(AVG(LV_2010), 2) "LV_2010_${i}",
                ROUND(AVG(LV_2011), 2) "LV_2011_${i}",
                ROUND(AVG(LV_2012), 2) "LV_2012_${i}",
                ROUND(AVG(LV_2013), 2) "LV_2013_${i}",
                ROUND(AVG(LV_2014), 2) "LV_2014_${i}",
                ROUND(AVG(LV_2015), 2) "LV_2015_${i}",
                ROUND(AVG(LV_2016), 2) "LV_2016_${i}",
                ROUND(AVG(LV_2017), 2) "LV_2017_${i}",
                ROUND(AVG(LV_2018), 2) "LV_2018_${i}",
                ROUND(AVG(LV_2019), 2) "LV_2019_${i}",
                ROUND(AVG(LV_2020), 2) "LV_2020_${i}"
                JOIN property p ON x.pid = p.pid
                WHERE p.ncode = ${i}`;
        }

        else if (context.selection === "tl") {
            baseQuery =
                `SELECT 
                ROUND(AVG(TL_2006), 2) "TL_2006_${i}",
                ROUND(AVG(TL_2007), 2) "TL_2007_${i}",
                ROUND(AVG(TL_2008), 2) "TL_2008_${i}",
                ROUND(AVG(TL_2009), 2) "TL_2009_${i}",
                ROUND(AVG(TL_2010), 2) "TL_2010_${i}",
                ROUND(AVG(TL_2011), 2) "TL_2011_${i}",
                ROUND(AVG(TL_2012), 2) "TL_2012_${i}",
                ROUND(AVG(TL_2013), 2) "TL_2013_${i}",
                ROUND(AVG(TL_2014), 2) "TL_2014_${i}",
                ROUND(AVG(TL_2015), 2) "TL_2015_${i}",
                ROUND(AVG(TL_2016), 2) "TL_2016_${i}",
                ROUND(AVG(TL_2017), 2) "TL_2017_${i}",
                ROUND(AVG(TL_2018), 2) "TL_2018_${i}",
                ROUND(AVG(TL_2019), 2) "TL_2019_${i}",
                ROUND(AVG(TL_2020), 2) "TL_2020_${i}"
                JOIN property p ON x.pid = p.pid
                WHERE p.ncode = ${i}`;
        }

        const result = await database.simpleExecute(baseQuery);

        final.concat(result.rows);
    }
    
    return final;
    
}

module.exports.avg = avg;