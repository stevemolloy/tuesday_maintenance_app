var MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;
var currentWeekNumber = require('current-week-number');

var express = require('express');
var router = express.Router();

router.get('/new_task', function(req, res, next) {
  res.render('new_task', {
    title: 'MAX-IV Maintenance Tasks',
    current_weeknumber: currentWeekNumber()
  });
});

router.get('/', function(req, res, next) {
  MaintenanceTask
    .find({})
    .sort({
      datetime: 1
    })
    .exec(function(err, reports) {
      if (err) return console.error(err);
      var linac_data = [],
        linac_ids = [];
      var r3_data = [],
        r3_ids = [];
      var r1_data = [],
        r1_ids = [];
      for (var i = reports.length - 1; i >= 0; i--) {
        if (taskShutsLinac(reports[i])) {
          var report = reports.splice(i, 1)[0];
          var commentstr = report.task;
          if (commentstr.length > 55) {
            commentstr = commentstr.substring(0, 55) + '...';
          }
          linac_data.push([
            report.week_number,
            report.reporter,
            report.where,
            report.fixer,
            commentstr
          ]);
          linac_ids.push(report._id);
        } else if (taskShutsR1(reports[i])) {
          var report = reports.splice(i, 1)[0];
          var commentstr = report.task;
          if (commentstr.length > 55) {
            commentstr = commentstr.substring(0, 55) + '...';
          }
          r1_data.push([
            report.week_number,
            report.reporter,
            report.where,
            report.fixer,
            commentstr
          ]);
          r1_ids.push(report._id);
        } else if (taskShutsR3(reports[i])) {
          var report = reports.splice(i, 1)[0];
          var commentstr = report.task;
          if (commentstr.length > 55) {
            commentstr = commentstr.substring(0, 55) + '...';
          }
          r3_data.push([
            report.week_number,
            report.reporter,
            report.where,
            report.fixer,
            commentstr
          ]);
          r3_ids.push(report._id);
        }
      }
      res.render('list_all', {
        title: 'MAX-IV Maintenance Tasks',
        linac_data: linac_data,
        linac_ids: linac_ids,
        r3_data: r3_data,
        r3_ids: r3_ids,
        r1_data: r1_data,
        r1_ids: r1_ids,
      });
    });
});

function taskShutsLinac(report) {
  return report.where.includes('linac') ||
    report.where.includes('R11') ||
    report.where.includes('R31');
}

function taskShutsR1(report) {
  return report.where.includes('R11') || report.where.includes('R12');
}

function taskShutsR3(report) {
  return report.where.includes('R32') ||
    report.where.includes('R33') ||
    report.where.includes('R34') ||
    report.where.includes('R35');
}

/* POST a new maintenance task */
router.post('/new_maintenance_task', function(req, res, next) {
  var timestamp = Date.now();
  var fullname = req.body.first_name + " " + req.body.last_name;
  var fixer = req.body.fixer;
  var where = '';
  var task = req.body.comment;
  var week_number = currentWeekNumber();
  var d = new Date().getDay();
  if (d >= 4) {
    week_number += 2;
  } else {
    week_number += 1;
  }

  if (Array.isArray(req.body.location)) {
    for (loc of req.body.location) {
      where += loc + ',';
    }
    if (where.charAt(where.length - 1) == ',') {
      where = where.slice(0, where.length - 1);
    }
  } else {
    where = req.body.location;
  }

  var task_object = new MaintenanceTask({
    datetime: timestamp,
    reporter: fullname,
    fixer: fixer,
    where: where,
    task: task,
    week_number: week_number
  });
  task_object.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

router.post('/edit_maintenance_task', function(req, res, next) {
  var timestamp = Date.now();
  var fullname = req.body.first_name + " " + req.body.last_name;
  var fixer = req.body.fixer;
  var where = req.body.location;
  var task = req.body.comment;
  var week_number = req.body.proposedweeknumber;

  var new_data = {
    datetime: timestamp,
    reporter: fullname,
    fixer: fixer,
    where: where,
    task: task,
    week_number: week_number
  };

  MaintenanceTask.findByIdAndUpdate(
    req.body.task_id,
    new_data,
    function(err, result) {
      if (err) console.console.error(err);
      res.redirect('/api/get/' + req.body.task_id);
    }
  );
});

module.exports = router;
