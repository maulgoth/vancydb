const fillmap = require('../models/Fillmap');

async function get(req, res, next) {
  try {
    const context = {};
    
    const rows = await fillmap.find(context);

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }
}



module.exports.get = get;