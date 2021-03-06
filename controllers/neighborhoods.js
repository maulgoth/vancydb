// const { parse } = require('dotenv/types');
const neighborhoods = require('../models/Neighborhood');

async function get(req, res, next) {
  try {
    const context = {};

    // { lv, tl, iv }
    context.selection = req.query.selection;

    // AVG, MEDIAN, MAX, MIN
    context.math = req.query.math;

    context.year_built = parseInt(req.query.year_built, 10);

    context.year_built_before = parseInt(req.query.year_built_before, 10);

    context.year_built_after = parseInt(req.query.year_built_after, 10);

    context.year_built_bw_first = parseInt(req.query.year_built_bw_first, 10);

    context.year_built_bw_sec = parseInt(req.query.year_built_bw_sec, 10);

    context.z_category = req.query.z_category;

    context.price_min = parseInt(req.query.price_min, 10);

    context.price_max = parseInt(req.query.price_max, 10);

    context.transit = req.query.transit;

    const rows = await neighborhoods.find(context);

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }
}



module.exports.get = get;