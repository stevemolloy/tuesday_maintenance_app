var MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;
var currentWeekNumber = require('current-week-number');

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

router.get('/edit/:faultId', function(req, res, next) {
  MaintenanceTask
    .findOne({
      '_id': req.params.faultId
    })
    .exec(function(err, report) {
      if (err) return console.error(err);
      console.log(report.week_number);
      res.render('edit_task', {
        title: 'MAX-IV Maintenance Tasks',
        report: report,
        current_weeknumber: currentWeekNumber()
      });
    });
});

module.exports = router;
