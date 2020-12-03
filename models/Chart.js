const database = require("../services/database");

async function find(context) {
  // Final array concatenates SELECT of each neighborhood
  let final = [];
  const math = context.math;
  const selection = context.selection;
  let choice;
  if (selection === "iv") choice = "improvement_value";
  else if (selection === "lv") choice = "land_value";
  else if (selection == "tl") choice = "tax_levy";

  for (i = 2006; i < 2020; i++) {
    let query = `SELECT 
    ROUND(${math}(${selection}_${i}), 0) "dollarval"
    FROM ${choice} x
    JOIN property p ON x.pid = p.pid`;

    // ALL ZONES ALL NEIGHBORHOODS
    if (context.z_category === "all" && context.ncode == 0) {
      // query += ` JOIN zones z ON p.zid = z.zid
      //           WHERE z_category='${context.z_category}'`;
    } //else query += ` WHERE 1 = 1 `;
    else if (context.z_category == "all")
      query += `\n WHERE p.ncode = ${context.ncode}`;
    else if (context.ncode == 0) {
      query += `\nJOIN zones z ON p.zid = z.zid
        WHERE z_category='${context.z_category}'`;
    }

    const binds = {};

    // YEAR_BUILT BETWEEN
    if (context.year_built_first && context.year_built_sec) {
      binds.year_built_first = context.year_built_first;
      binds.year_built_sec = context.year_built_sec;
      query +=
        "\n AND year_built BETWEEN :year_built_first AND :year_built_sec";
    }

    // IF PRICE MIN AND PRICE MAX
    if (context.price_min && context.price_max) {
      binds.price_min = context.price_min;
      binds.price_max = context.price_max;
      query += `\n AND ${selection}_${year} BETWEEN :price_min AND price_max`;
    }

    const result = await database.simpleExecute(query, binds);
    result.rows["0"].year = i;
    final = final.concat(result.rows);
  }

  return final;
}

module.exports.find = find;
