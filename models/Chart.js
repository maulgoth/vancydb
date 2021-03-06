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

  if (context.display === "both") {
    console.log("both");
    for (i = 2006; i < 2020; i++) {
      let query = `SELECT 
      ROUND(${math}(${selection}_${i}), 0) "dollarval"
      FROM ${choice} x
      JOIN property p ON x.pid = p.pid`;

      // ALL ZONES ALL NEIGHBORHOODS
      // else if (context.z_category == "all")
      //   query += `\n WHERE p.ncode = ${context.ncode}`;
      // else if (context.ncode == 0) {
      //   query += `\nJOIN zones z ON p.zid = z.zid
      //     WHERE z_category='${context.z_category}'`;
      // }

      const binds = {};

      // YEAR_BUILT BETWEEN
      if (context.year_built_first && context.year_built_sec) {
        binds.year_built_first = context.year_built_first;
        binds.year_built_sec = context.year_built_sec;
        query +=
          "\n AND year_built BETWEEN :year_built_first AND :year_built_sec";
      }

      // IF PRICE MIN AND PRICE MAX
      //if (context.price_min && context.price_max) {
      binds.price_min = context.price_min;
      binds.price_max = context.price_max;
      query += `\n AND ${selection}_${i} BETWEEN :price_min AND :price_max`;
      //}

      if (i === 2006)
        console.log(query);

      const result = await database.simpleExecute(query, binds);
      result.rows["0"].year = i;

      final = final.concat(result.rows);
    }
  }

  else if (context.display === "nhood") {
    console.log("nhood all mode");

    if (context.range === 1) {nhoodStart = 1; nhoodMax = 5}
    else if (context.range === 2) {nhoodStart = 1; nhoodMax = 23}
    // else if (context.range === 3) {nhoodStart = 9; nhoodMax = 13}
    // else if (context.range === 4) {nhoodStart = 13; nhoodMax = 17}
    // else if (context.range === 5) {nhoodStart = 17; nhoodMax = 21}
    // else if (context.range === 6) {nhoodStart = 21; nhoodMax = 23}



    for (nhood = nhoodStart; nhood < nhoodMax; nhood++) {
      console.log(nhood);
      let temp = [];
      for (i = 2006; i < 2020; i++) {
        //console.log(i);
        let query = `SELECT 
          ROUND(${math}(${selection}_${i}), 0) "dollarval"
          FROM ${choice} x
          JOIN property p ON x.pid = p.pid`;

        if (context.z_category !== "all") {
          query += `\nJOIN zones z ON p.zid = z.zid
              WHERE z_category='${context.z_category}'`;
        }
        else
          query += `\nWHERE 1=1 `

        query += `\n AND p.ncode = ${nhood} 
        AND ${selection}_${i} IS NOT NULL
        `;

        const binds = {};

        // YEAR_BUILT BETWEEN
        if (context.year_built_first && context.year_built_sec) {
          binds.year_built_first = context.year_built_first;
          binds.year_built_sec = context.year_built_sec;
          query +=
            "\n AND year_built BETWEEN :year_built_first AND :year_built_sec";
        }

        //IF PRICE MIN AND PRICE MAX
        if (context.price_min && context.price_max) {
          binds.price_min = context.price_min;
          binds.price_max = context.price_max;
          query += `\n AND ${selection}_${i} BETWEEN :price_min AND :price_max`;
        }

        if (i === 2006 && nhood === nhoodStart)
          console.log(query);

        const result = await database.simpleExecute(query, binds);
        result.rows["0"].year = i;
        temp = temp.concat(result.rows);
      }

      final[nhood - 1] = temp;
    }
  }

  else if (context.display === "zone") {
    console.log("zone all mode");
    for (currzone = 0; currzone < ZONEITEMS.length; currzone++) {
      console.log(currzone);
      let temp = [];
      for (i = 2006; i < 2020; i++) {
        //console.log(i);
        let query = `SELECT 
          ROUND(${math}(${selection}_${i}), 0) "dollarval"
          FROM ${choice} x
          JOIN property p ON x.pid = p.pid`;

          query += `\nJOIN zones z ON p.zid = z.zid
              WHERE z_category='${ZONEITEMS[currzone]}'`;

        if (context.ncode != 0)
          query += `\n AND p.ncode = ${context.ncode} `;

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
          query += `\n AND ${selection}_${i} BETWEEN :price_min AND :price_max`;
        }

        if (i === 2006 && currzone === 0)
          console.log(query);

        const result = await database.simpleExecute(query, binds);
        result.rows["0"].year = i;
        temp = temp.concat(result.rows);
      }

      final[currzone] = temp;
    }
  }

  // //console.log(final);
  return final;




}

module.exports.find = find;
