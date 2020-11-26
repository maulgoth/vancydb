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

  // GET OCTILES 
  let query = `WITH\nall_prices AS (\nSELECT val FROM (\n`;
  for (i = 2006; i < 2020; i++)
    query += `SELECT ${selection}_${i} AS val FROM ${choice}  WHERE ${selection}_${i} IS NOT NULL UNION ALL\n`;
  query += `SELECT iv_2020 AS val FROM improvement_value WHERE iv_2020 IS NOT NULL\n)),\n
  octiles AS (\nSELECT val, NTILE(8) OVER (ORDER BY val DESC) octile FROM all_prices),\n
  octolimits AS (\n`;
  for (i = 1; i < 8; i++)
    query += `SELECT MAX(val) AS oct FROM octiles WHERE octile = ${i} UNION ALL\n`;
  query += `SELECT MAX(val) AS oct FROM octiles WHERE octile = 8\n)
  SELECT * FROM octolimits`;

  const limits = await database.simpleExecute(query);
  let octolimits = [];
  for (i = 0; i < 8; i++)
    octolimits[i] = limits.rows[i].OCT;
  for (i = 0; i < 8; i++)
    console.log(octolimits[i]);

  // Loop for each of 22 NEIGHBORHOODS
  for (i = 1; i < 23; i++) {
    query = '';
    query += `WITH temp AS ( SELECT \n`;
    // Execute operation per year
    for (j = 2006; j < 2020; j++)
      query += `ROUND(${math}(${selection}_${j}), 0) "${j}",\n`;
    query += `ROUND(${math}(${selection}_2020), 0) "2020"\n`;
    query += `FROM ${choice} x JOIN property p ON x.pid = p.pid\n`;

    // CHOOSE ZONE CATEGORY
    if (context.z_category)
      query += ` JOIN zones z ON p.zid = z.zid WHERE z_category='${context.z_category}'\n`;
    else
      query += ` WHERE 1 = 1 \n`;

    // ITERATE FOR EACH NEIGHBORHOOD
    query += `\n AND p.ncode = ${i}\n`;

    const binds = {};

    // YEAR_BUILT BETWEEN
    if (context.year_built_bw_first && context.year_built_bw_sec) {
      binds.year_built_bw_first = context.year_built_bw_first;
      binds.year_built_bw_sec = context.year_built_bw_sec;
      query +=
        `\n AND year_built BETWEEN :year_built_bw_first AND :year_built_bw_sec\n`;
    }

    // Add Quartile (Eighth)
    query += `) SELECT `;
    for (j = 2006; j < 2020; j++) {
      query += `
        CASE
          WHEN "${j}" BETWEEN 0 AND ${octolimits[7]} THEN 'q1'
          WHEN "${j}" BETWEEN ${octolimits[7]} AND ${octolimits[6]} THEN 'q2'
          WHEN "${j}" BETWEEN ${octolimits[6]} AND ${octolimits[5]} THEN 'q3'
          WHEN "${j}" BETWEEN ${octolimits[5]} AND ${octolimits[4]} THEN 'q4'
          WHEN "${j}" BETWEEN ${octolimits[4]} AND ${octolimits[3]} THEN 'q5'
          WHEN "${j}" BETWEEN ${octolimits[3]} AND ${octolimits[2]} THEN 'q6'
          WHEN "${j}" BETWEEN ${octolimits[2]} AND ${octolimits[1]} THEN 'q7'
          ELSE 'q8'
        END "${j}q", "${j}",`;
    }
    query += `
      CASE
          WHEN "2020" BETWEEN 0 AND ${octolimits[7]} THEN 'q1'
          WHEN "2020" BETWEEN ${octolimits[7]} AND ${octolimits[6]} THEN 'q2'
          WHEN "2020" BETWEEN ${octolimits[6]} AND ${octolimits[5]} THEN 'q3'
          WHEN "2020" BETWEEN ${octolimits[5]} AND ${octolimits[4]} THEN 'q4'
          WHEN "2020" BETWEEN ${octolimits[4]} AND ${octolimits[3]} THEN 'q5'
          WHEN "2020" BETWEEN ${octolimits[3]} AND ${octolimits[2]} THEN 'q6'
          WHEN "2020" BETWEEN ${octolimits[2]} AND ${octolimits[1]} THEN 'q7'
          ELSE 'q8'
        END "2020q", 2020 "2020"
      `;
    query += `FROM temp`;
    // Hit Database with query and concatenate
    // console.log(query);
    const result = await database.simpleExecute(query, binds);
    result.rows["0"].nhood_code = i;
    final = final.concat(result.rows);
  }

  return final;
}

module.exports.find = find;
