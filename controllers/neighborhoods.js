const neighborhoods = require('../models/Neighborhood');

async function get(req, res, next) {
  try {
    const context = {};

    // { lv, tl, iv }
    context.selection = req.query.selection;

    // AVG, MEDIAN, MAX, MIN
    context.math = req.query.math;

    const rows = await neighborhoods.find(context);

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }
}



module.exports.get = get;