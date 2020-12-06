const database = require("../services/database");

async function find(context) {
  // Final array concatenates SELECT of each neighborhood
  let final = [];
  const math = context.math;
  const selection = context.selection;
  let choice;
  if (selection === "iv") choice = "improvement_value";
  else if (selection === "lv") choice = "land_value";
  else if (selection === "tl") choice = "tax_levy";

  const ZONEITEMS = [
    "Comprehensive Development",
    "Two Family Dwelling",
    "Industrial",
    "Historic Area",
    "Commercial",
    "Light Industrial",
    "Limited Agricultural",
    "Multiple Family Dwelling",
    "One Family Dwelling"
  ]

  for (i = 2006; i < 2020; i++) {

    // ROUND(${math}(${selection}_${i}), 0) "dollarval",

    let query = `SELECT ${selection}_${i} AS "dollarval"`;
    if (i === 2006)
      query += `, line_1, line_2, line_3, line_4, line_5, nhood_name`;
    query += ` FROM ${choice} x JOIN property p ON x.pid = p.pid `;
    if (i === 2006) {
      query += `JOIN neighborhoods n ON p.ncode = n.ncode
      JOIN narrative_legal l ON p.pid = l.pid`;
    }
    query += ` JOIN address a ON a.pid = p.pid`;
    query += ` 
      WHERE ('${context.civic_number}' = FROM_CIVIC_NUMBER OR
      '${context.civic_number}' = TO_CIVIC_NUMBER) AND
      '${context.street_name}' = STREET_NAME AND
      '${context.postal_code}' = PROPERTY_POSTAL_CODE
      
      FETCH FIRST 1 ROW ONLY
      `;

    const binds = {};
    // console.log("\n\n\n" + query + "\n\n\n");
    const result = await database.simpleExecute(query, binds);
    if (result.rows["0"])
      result.rows["0"].year = i;

    // GET HPI

    query = "";
    query += `SELECT ROUND(${math}(composite_hpi_sa),0) AS hpi FROM hpi_vancouver
        WHERE year = ${i}`
    const hpi = await database.simpleExecute(query);
    // console.log(hpi.rows);
    result.rows["0"].hpi = hpi.rows["0"].HPI;


    final = final.concat(result.rows);
  }


  // console.log(final);
  return final;




}

module.exports.find = find;
