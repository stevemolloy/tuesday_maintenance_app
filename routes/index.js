const MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;
const currentWeekNumber = require('current-week-number');

const express = require('express');
const router = express.Router();
const async = require('async');

router.get('/new_task', function(req, res, next) {
  let week_number = currentWeekNumber();
  const d = new Date().getDay();
  if (d >= 4) {
    week_number += 2;
  } else {
    week_number += 1;
  }
  res.render('new_task', {
    title: 'MAX-IV Maintenance Tasks',
    current_weeknumber: week_number
  });
});

router.get('/', function(req, res, next) {
  res.redirect('/summary/all/all');
});

router.get('/summary/:val', function(req, res, next) {
  res.redirect('/summary/week_number/' + req.params.val);
});

router.get('/summary/:key/:value', function(req, res, next) {
  const search_term = {};
  if (req.params.key !== 'all' | req.params.value !== 'all') {
    search_term[req.params.key] = req.params.value;
  }

  var functionStack = [];
  functionStack.push((callback) => {
    MaintenanceTask
      .find({})
      .sort({
        week_number: 1
      })
      .exec((err, docs) => {
        if (err) throw callback(err);
        var week_numbers = [];
        for (let i = 0; i < docs.length; i++) {
          var week_number = docs[i].week_number;
          if (!week_numbers.includes(week_number)) {
            week_numbers.push(week_number);
          }
        }
        callback(null, week_numbers);
      });
  });

  functionStack.push((callback) => {
    MaintenanceTask
      .find(search_term)
      .sort({
        week_number: -1
      })
      .exec(function(err, reports) {
        if (err) return console.error(err);
        data = generate_data(reports);
        callback(null, data);
      });
  });

  async.parallel(
    functionStack,
    (err, data) => {
      if (err) console.log(error);
      res.render('list_all', {
        title: 'MAX-IV Maintenance Tasks',
        linac_data: data[1].linac_data,
        linac_ids: data[1].linac_ids,
        other_data: data[1].other_data,
        other_ids: data[1].other_ids,
        r3_data: data[1].r3_data,
        r3_ids: data[1].r3_ids,
        r1_data: data[1].r1_data,
        r1_ids: data[1].r1_ids,
        week_numbers: data[0]
      });
    }
  );
});

function generate_data(reports) {
  const other_data = [];
  const other_ids = [];
  const linac_data = [];
  const linac_ids = [];
  const r3_data = [];
  const r3_ids = [];
  const r1_data = [];
  const r1_ids = [];
  for (let i = reports.length - 1; i >= 0; i--) {
    let report, commentstr;
    if (taskShutsLinac(reports[i])) {
      report = reports.splice(i, 1)[0];
      commentstr = report.task;
      if (commentstr.length > 55) {
        commentstr = commentstr.substring(0, 55) + '...';
      }
      linac_data.push([
        report.week_number,
        report.reporter,
        report.where,
        report.fixer,
        report.done_yet ? report.done_yet : 'No',
        commentstr
      ]);
      linac_ids.push(report._id);
    } else if (taskShutsR1(reports[i])) {
      report = reports.splice(i, 1)[0];
      commentstr = report.task;
      if (commentstr.length > 55) {
        commentstr = commentstr.substring(0, 55) + '...';
      }
      r1_data.push([
        report.week_number,
        report.reporter,
        report.where,
        report.fixer,
        report.done_yet ? report.done_yet : 'No',
        commentstr
      ]);
      r1_ids.push(report._id);
    } else if (taskShutsR3(reports[i])) {
      report = reports.splice(i, 1)[0];
      commentstr = report.task;
      if (commentstr.length > 55) {
        commentstr = commentstr.substring(0, 55) + '...';
      }
      r3_data.push([
        report.week_number,
        report.reporter,
        report.where,
        report.fixer,
        report.done_yet ? report.done_yet : 'No',
        commentstr
      ]);
      r3_ids.push(report._id);
    } else if (taskForOther(reports[i])) {
      report = reports.splice(i, 1)[0];
      commentstr = report.task;
      if (commentstr.length > 55) {
        commentstr = commentstr.substring(0, 55) + '...';
      }
      other_data.push([
        report.week_number,
        report.reporter,
        report.where,
        report.fixer,
        report.done_yet ? report.done_yet : 'No',
        commentstr
      ]);
      other_ids.push(report._id);
    }
  }
  return {
    linac_data,
    linac_ids,
    other_data,
    other_ids,
    r3_data,
    r3_ids,
    r1_data,
    r1_ids
  };
}

function taskShutsLinac(report) {
  return report.where.includes('linac') ||
    report.where.includes('R11') ||
    report.where.includes('R31');
}

function taskShutsR1(report) {
  return report.where.includes('R11') || report.where.includes('R12');
}

function taskShutsR3(report) {
  return report.where.includes('R31') ||
    report.where.includes('R32') ||
    report.where.includes('R33') ||
    report.where.includes('R34') ||
    report.where.includes('R35');
}

function taskForOther(report) {
  return report.where.includes('other');
}

/* POST a new maintenance task */
router.post('/new_maintenance_task', function(req, res, next) {
  const timestamp = Date.now();
  const fullname = req.body.first_name + " " + req.body.last_name;
  const fixer = req.body.fixer;
  const task = req.body.comment;
  const week_number = req.body.proposedweeknumber;
  let where = '';

  if (Array.isArray(req.body.location)) {
    for (let loc of req.body.location) {
      where += loc + ',';
    }
    if (where.charAt(where.length - 1) == ',') {
      where = where.slice(0, where.length - 1);
    }
  } else {
    where = req.body.location;
  }

  const task_object = new MaintenanceTask({
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
  const timestamp = Date.now();
  const fullname = req.body.first_name + " " + req.body.last_name;
  const fixer = req.body.fixer;
  const where = req.body.location;
  const task = req.body.comment;
  const week_number = req.body.proposedweeknumber;

  const new_data = {
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
