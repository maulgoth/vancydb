const express = require('express');
const router = express.Router();
const properties = require('../controllers/properties');
const neighborhoods = require('../controllers/neighborhoods');
const charts = require('../controllers/charts');
const fillmap = require('../controllers/fillmap');
const hpis = require('../controllers/hpis');
const addresses = require('../controllers/addresses');

router.route('/properties/:pid?')
    .get(properties.get);
// .post(properties.post)
// .put(properties.put)
// .delete(properties.delete);

router.route('/neighborhoods/')
    .get(neighborhoods.get);
// .post(properties.post)
// .put(properties.put)
// .delete(properties.delete);



router.route('/hpis/')
    .get(hpis.get);
// .post(properties.post)
// .put(properties.put)
// .delete(properties.delete);

router.route('/addresses/')
    .get(addresses.get);
// .post(properties.post)
// .put(properties.put)
// .delete(properties.delete);

router.route('/charts/')
    .get(charts.get);

router.route('/fillmap/')
    .get(fillmap.get);

module.exports = router;