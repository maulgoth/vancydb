const neighborhoods = require('../models/Neighborhood');

async function get(req, res, next) {
  try {
    const context = {};

    context.selection = req.params.selection;

    context.math = req.params.math;
    
    const rows;

    if (context.math === "avg")
        rows = await neighborhoods.avg(context);

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }
}



module.exports.get = get;