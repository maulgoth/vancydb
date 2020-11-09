const database = require('../services/database');

// example queries:
// localhost:5000/api/properties
// localhost:5000/api/properties?zid=4&ncode=6


const baseQuery =
  `SELECT pid "PID",
      zid "zid",
      ncode "ncode",
      year_built "year_built",
      legal_type "legal_type"
    FROM property
    WHERE 1=1`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  // PID
  if (context.pid) {
    binds.pid = context.pid;
    query += `\nAND pid = :pid`;
  }

  // NCODE
  if (context.ncode) {
    binds.ncode = context.ncode;
    query += '\nAND ncode = :ncode';
  }

  // ZID
  if (context.zid) {
    binds.zid = context.zid;
    query += '\nAND zid = :zid';
  }

  // YEAR_BUILT
  if (context.year_built) {
    binds.year_built = context.year_built;
    query += '\n AND year_built = :year_built';
  }

  // YEAR_BUILT BETWEEN
  if (context.year_built_bw_first && context.year_built_bw_sec) {
      binds.year_built_bw_first = context.year_built_bw_first;
      binds.year_built_bw_sec = context.year_built_bw_sec;
      query += '\n AND year_built BETWEEN :year_built_bw_first AND :year_built_bw_sec';
    }

  // YEAR_BUILT BEFORE
  if (context.year_built_before) {
    binds.year_built = context.year_built_before;
    query += '\n AND year_built < :year_built';
  }

  // YEAR_BUILT AFTER
  if (context.year_built_after) {
    binds.year_built = context.year_built_after;
    query += '\n AND year_built > :year_built';
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