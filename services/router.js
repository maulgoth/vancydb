const express = require('express');
const router = express.Router();
const properties = require('../controllers/properties');

router.route('/properties/:pid?')
    .get(properties.get);
    // .post(properties.post)
    // .put(properties.put)
    // .delete(properties.delete);

module.exports = router;