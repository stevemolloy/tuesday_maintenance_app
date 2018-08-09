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
    });
});

router.get('/edit/:faultId', function(req, res, next) {
  MaintenanceTask
    .findOne({
      '_id': req.params.faultId
    })
    .exec(function(err, report) {
      if (err) return console.error(err);
      res.render('edit_task', {
        title: 'MAX-IV Maintenance Tasks',
        report: report,
        current_weeknumber: currentWeekNumber()
      });
    });
});

router.get('/markdone/:faultId', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'done_yet': 'Yes'}},
    function(err, result) {
      if (err) console.error(err);
      res.redirect('/api/get/' + req.params.faultId);
    }
  );
});

router.get('/archive/:faultId', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'archived': true}},
    function(err, result) {
      if (err) console.error(err);
      res.redirect('/');
    }
  );
});

module.exports = router;
