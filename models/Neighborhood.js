const database = require("../services/database");

async function find(context) {
  // Final array concatenates SELECT of each neighborhood
  let final = [];
  // Store selection and math operation choices
  const math = context.math;
  const selection = context.selection;
  let choice;
  if (selection === "iv") choice = "improvement_value";
  else if (selection === "lv") choice = "land_value";
  else if (selection == "tl") choice = "tax_levy";

  for (i = 1; i < 23; i++) {
    let query = `
      WITH total_sum AS ()



      SELECT 
      ROUND(${math}(${selection}_2006), 0) "2006",
      ROUND(${math}(${selection}_2007), 0) "2007",
      ROUND(${math}(${selection}_2008), 0) "2008",
      ROUND(${math}(${selection}_2009), 0) "2009",
      ROUND(${math}(${selection}_2010), 0) "2010",
      ROUND(${math}(${selection}_2011), 0) "2011",
      ROUND(${math}(${selection}_2012), 0) "2012",
      ROUND(${math}(${selection}_2013), 0) "2013",
      ROUND(${math}(${selection}_2014), 0) "2014",
      ROUND(${math}(${selection}_2015), 0) "2015",
      ROUND(${math}(${selection}_2016), 0) "2016",
      ROUND(${math}(${selection}_2017), 0) "2017",
      ROUND(${math}(${selection}_2018), 0) "2018",
      ROUND(${math}(${selection}_2019), 0) "2019",
      ROUND(${math}(${selection}_2020), 0) "2020"
      FROM ${choice} x
      JOIN property p ON x.pid = p.pid`;

    // CHOOSE ZONE CATEGORY
    if (context.z_category) {
      query += ` JOIN zones z ON p.zid = z.zid
                WHERE z_category='${context.z_category}'`;
    } else {
      query += ` WHERE 1 = 1 `;
    }

    query += `\n AND p.ncode = ${i}`;

    const binds = {};

    // YEAR_BUILT BETWEEN
    if (context.year_built_bw_first && context.year_built_bw_sec) {
      binds.year_built_bw_first = context.year_built_bw_first;
      binds.year_built_bw_sec = context.year_built_bw_sec;
      query +=
        "\n AND year_built BETWEEN :year_built_bw_first AND :year_built_bw_sec";
    }

    const result = await database.simpleExecute(query, binds);
    result.rows["0"].nhood_code = i;
    final = final.concat(result.rows);
  }

  return final;
}

module.exports.find = find;
