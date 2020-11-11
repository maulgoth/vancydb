const neighborhoods = require('../models/Neighborhood');

async function get(req, res, next) {
  try {
    const context = {};

    context.selection = req.query.selection;

    context.math = req.query.math;

    console.log(context.math);

    console.log(context.selection);

    let rows = [];

    if (context.math === "avg") {
        rows = await neighborhoods.avg(context);
    
    }

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }
}



module.exports.get = get;