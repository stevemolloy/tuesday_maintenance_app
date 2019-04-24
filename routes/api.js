var MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;
var currentWeekNumber = require('current-week-number');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('..');
});

router.get('/get/:faultId', function(req, res, next) {
  res.redirect('/api/get/' + req.params.faultId + '/all');
})

router.get('/get/:faultId/:selected_week', function(req, res, next) {
  MaintenanceTask
    .findOne({
      '_id': req.params.faultId
    })
    .exec(function(err, report) {
      if (err) return console.error(err);
      res.render('list_one', {
        title: 'MAX-IV: Maintenance Tasks',
        report: report,
        selected_week: req.params.selected_week
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
        title: 'MAX-IV: Maintenance Tasks',
        report: report,
        current_weeknumber: currentWeekNumber()
      });
    });
});

router.get('/approve/:faultId', function(req, res, next) {
  res.redirect('/api/approve/' + req.params.faultId + '/all');
})

router.get('/approve/:faultId/:selected_week', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'approved': true}},
    function(err, result) {
      if (err) console.error(err);
      if (req.params.selected_week === 'all') {
        res.redirect('/');
      } else {
        res.redirect('/summary/' + req.params.selected_week);
      }
    }
  );
});

router.get('/mark_done/:faultId', function(req, res, next) {
  res.redirect('/api/mark_done/' + req.params.faultId + '/all');
})

router.get('/mark_done/:faultId/:selected_week', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'done': true}},
    function(err, result) {
      if (err) console.error(err);
      if (req.params.selected_week === 'all') {
        res.redirect('/');
      } else {
        res.redirect('/summary/' + req.params.selected_week);
      }
    }
  );
});

router.get('/mark_not_done/:faultId', function(req, res, next) {
  res.redirect('/api/mark_not_done/' + req.params.faultId + '/all');
})

router.get('/mark_not_done/:faultId/:selected_week', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'done': false}},
    function(err, result) {
      if (err) console.error(err);
      if (req.params.selected_week === 'all') {
        res.redirect('/');
      } else {
        res.redirect('/summary/' + req.params.selected_week);
      }
    }
  );
});

router.get('/unapprove/:faultId', function(req, res, next) {
  res.redirect('/api/unapprove/' + req.params.faultId + '/all');
})

router.get('/unapprove/:faultId/:selected_week', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'approved': false}},
    function(err, result) {
      if (err) console.error(err);
      if (req.params.selected_week === 'all') {
        res.redirect('/');
      } else {
        res.redirect('/summary/' + req.params.selected_week);
      }
    }
  );
});

router.get('/archive/:faultId', function(req, res, next) {
  res.redirect('/api/archive/' + req.params.faultId + '/all');
})

router.get('/archive/:faultId/:selected_week', function(req, res, next) {
  MaintenanceTask.findByIdAndUpdate(
    req.params.faultId,
    {$set: {'archived': true}},
    function(err, result) {
      if (err) console.error(err);
      if (req.params.selected_week === 'all') {
        res.redirect('/');
      } else {
        res.redirect('/summary/' + req.params.selected_week);
      }
    }
  );
});

module.exports = router;
