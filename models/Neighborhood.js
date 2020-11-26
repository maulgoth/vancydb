const database = require("../services/database");

async function find(context) {
  // Final array concatenates SELECT of each neighborhood
  let final = {};

  // Store selection and math operation choices
  const math = context.math;
  const selection = context.selection;
  let choice;
  if (selection === "iv") choice = "improvement_value";
  else if (selection === "lv") choice = "land_value";
  else if (selection == "tl") choice = "tax_levy";
  const binds = {};

  for (year = 2006; year < 2021; year++) {
    query = '';
    query += `WITH averages AS ( \n`;
    for (j=1; j < 23; j++) {
        query += `SELECT ROUND(${math}(${selection}_${year}), 0) val, ncode FROM ${choice} i JOIN property p ON i.pid = p.pid`;
        // CHOOSE ZONE CATEGORY
        if (context.z_category)
            query += ` JOIN zones z ON p.zid = z.zid WHERE z_category='${context.z_category}' `;
        else
            query += ` WHERE 1 = 1 \n`;
        // YEAR_BUILT BETWEEN
        if (context.year_built_bw_first && context.year_built_bw_sec) {
            binds.year_built_bw_first = context.year_built_bw_first;
            binds.year_built_bw_sec = context.year_built_bw_sec;
            query +=
            `\n AND year_built BETWEEN :year_built_bw_first AND :year_built_bw_sec\n`;
        }
        if (j < 22)
            query += ` AND ncode = ${j} GROUP BY ncode UNION ALL\n`;
        else
            query += ` AND ncode = ${j} GROUP BY ncode\n`;
    }

    query += `)\n SELECT val, ncode, NTILE(8) OVER (ORDER BY val ASC) octile FROM averages ORDER BY ncode DESC`;

    // Hit Database with query and concatenate
    const result = await database.simpleExecute(query, binds);
    // return result;
    final[year] = result.rows;
  }

  return final;
}

module.exports.find = find;
