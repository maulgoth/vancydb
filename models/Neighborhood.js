const database = require("../services/database");

async function find(context) {
  // Final array concatenates SELECT of each neighborhood
  let final = {};
  final['limits'] = {};
  // Store selection and math operation choices
  const math = context.math;
  const selection = context.selection;
  let choice;
  if (selection === "iv") choice = "improvement_value";
  else if (selection === "lv") choice = "land_value";
  else if (selection == "tl") choice = "tax_levy";
  const binds = {};

  for (year = 2006; year < 2008; year++) {
    query = "";
    query += `WITH averages AS ( \n`;
    for (j = 1; j < 23; j++) {
      query += `SELECT ROUND(${math}(${selection}_${year}), 0) val, p.ncode FROM ${choice} i JOIN property p ON i.pid = p.pid`;

      // If transit
      if (context.transit === "true") {
        query += ` JOIN transit t ON p.ncode = t.ncode `;
      }

      // CHOOSE ZONE CATEGORY
      if (context.z_category)
        query += ` JOIN zones z ON p.zid = z.zid WHERE z_category='${context.z_category}' `;
      else query += ` WHERE 1 = 1 \n`;

      // YEAR_BUILT BETWEEN
      if (context.year_built_bw_first && context.year_built_bw_sec) {
        binds.year_built_bw_first = context.year_built_bw_first;
        binds.year_built_bw_sec = context.year_built_bw_sec;
        query += `\n AND year_built BETWEEN :year_built_bw_first AND :year_built_bw_sec\n`;
      }

      // IF PRICE MIN AND PRICE MAX
      if (context.price_min && context.price_max) {
        binds.price_min = context.price_min;
        binds.price_max = context.price_max;
        query += `\n AND ${selection}_${year} BETWEEN :price_min AND :price_max`;
      }

      if (j < 22) query += ` AND p.ncode = ${j} GROUP BY p.ncode UNION ALL\n`;
      else query += ` AND p.ncode = ${j} GROUP BY p.ncode\n`;
    }

    // Store temp results
    query += `),\n results AS\n(SELECT val, a.ncode, nhood_name, 
    NTILE(8) OVER (ORDER BY val ASC) AS octile FROM 
    averages a JOIN neighborhoods n ON a.ncode = n.ncode 
    ORDER BY ncode ASC),\n`;

    // Get minimums
    query += `\noctolimits AS (
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 1 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 2 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 3 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 4 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 5 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 6 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 7 GROUP BY octile UNION ALL
      SELECT MIN(val) AS oct_min, octile AS oct2 FROM results WHERE octile = 8 GROUP BY octile
      )`
    
    // Final SELECT of query
    query += `SELECT val, ncode, octile, oct_min FROM octolimits, results WHERE oct2 = octile`

    // console.log(query);

    // Hit Database with query and concatenate
    const result = await database.simpleExecute(query, binds);
    // return result;
    final[year] = result.rows;

    // Catch nulls
    let temp = [];
    let limits = [];
    for (i = 0; i < final[year].length; i++)
      temp[final[year][i].NCODE - 1] = final[year][i];
    for (i = 0; i < 22; i++) {
      if (!temp[i])
        temp[i] = { VAL: 0, NCODE: i + 1, OCTILE: 0 };
      else {
        limits[temp[i].OCTILE - 1] = temp[i].OCT_MIN;
      }
    }

    final[year] = temp;
    // console.log(limits);
    
    final['limits'][year] = limits;
  }

  return final;
}

module.exports.find = find;
