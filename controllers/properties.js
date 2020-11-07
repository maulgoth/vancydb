const properties = require('../models/Property');

async function get(req, res, next) {
  try {
    const context = {};

    context.pid = parseInt(req.params.pid, 10);

    context.skip = parseInt(req.query.skip, 10);

    context.limit = parseInt(req.query.limit, 10);

    context.ncode = parseInt(req.query.ncode, 10);

    context.zid = parseInt(req.query.zid, 10);

    const rows = await properties.find(context);

    if (req.params.pid) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}



module.exports.get = get;