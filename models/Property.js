const database = require('../services/database');

const baseQuery =
  `SELECT pid "PID",
      zid "zid",
      ncode "ncode",
      year_built "year_built",
      lot "lot",
      district_lot "district_lot",
      legal_type "legal_type",
      plan_no "plan_no",
      block_no "block_no"
    FROM property`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  // WHERE
  if (context.id) {
    binds.pid = context.id;

    query += `\nWHERE pid = :pid`;
  }

  // SKIP
  if (context.skip) {
    binds.row_offset = context.skip;
    query += '\nOFFSET :row_offset ROWS';
  }

  // LIMIT (default is 30 for testing purposes to not hang DB)
  const limit = (context.limit > 0) ? context.limit : 30;
  binds.row_limit = limit;
  query += '\nFETCH NEXT :row_limit ROWS ONLY';

  // Fetch result
  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;