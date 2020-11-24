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

  for (i = 2006; i < 2021; i++) {
    let query = `SELECT 
    ROUND(${math}(${selection}_${i}), 0) "dollarval"
    FROM ${choice} x
    JOIN property p ON x.pid = p.pid`;

    // CHOOSE ZONE CATEGORY
    if (context.z_category) {
      query += ` JOIN zones z ON p.zid = z.zid
                WHERE z_category='${context.z_category}'`;
    } 
    else
      query += ` WHERE 1 = 1 `;

    if (context.ncode)
      query += `\n AND p.ncode = ${context.ncode}`;

    const binds = {};

    // YEAR_BUILT
    if (context.year_built) {
      binds.year_built = context.year_built;
      query += "\n AND year_built = :year_built";
    }

    // YEAR_BUILT BETWEEN
    if (context.year_built_first && context.year_built_sec) {
      binds.year_built_first = context.year_built_first;
      binds.year_built_sec = context.year_built_sec;
      query +=
        "\n AND year_built BETWEEN :year_built_first AND :year_built_sec";
    }

    // YEAR_BUILT BEFORE
    if (context.year_built_before) {
      binds.year_built = context.year_built_before;
      query += "\n AND year_built < :year_built";
    }

    // YEAR_BUILT AFTER
    if (context.year_built_after) {
      binds.year_built = context.year_built_after;
      query += "\n AND year_built > :year_built";
    }

    const result = await database.simpleExecute(query, binds);
    result.rows['0'].year = i;
    final = final.concat(result.rows);
  }

  return final;
}

module.exports.find = find;
