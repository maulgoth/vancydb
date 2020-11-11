const express = require('express');
const router = express.Router();
const properties = require('../controllers/properties');
const neighborhoods = require('../controllers/neighborhoods');
//const users = require('../controllers/users');


router.route('/properties/:pid?')
    .get(properties.get);
    // .post(properties.post)
    // .put(properties.put)
    // .delete(properties.delete);

router.route('/neighborhoods/:ncode?')
    .get(neighborhoods.get);
    // .post(properties.post)
    // .put(properties.put)
    // .delete(properties.delete);

/*
router.route('/users/:uid?')
    .get(users.get)
    .post(users.post);
    // .put(properties.put)
    // .delete(properties.delete);
*/

module.exports = router;