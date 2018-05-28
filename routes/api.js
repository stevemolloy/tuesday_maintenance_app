var MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('..');
});

router.get('/get/:faultId', function(req, res, next) {
  MaintenanceTask
    .findOne({
      '_id': req.params.faultId
    })
    .exec(function(err, report) {
      if (err) return console.error(err);
      res.render('list_one', {
        title: 'MAX-IV Maintenance Tasks',
        report: report
      });
    })
});

module.exports = router;
