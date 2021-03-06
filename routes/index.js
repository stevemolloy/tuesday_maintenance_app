const MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;
const AccessDetails = require('../models/access').AccessDetails;
const currentWeekNumber = require('current-week-number');
const he = require('he');

const express = require('express');
const router = express.Router();
const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

function isInteger(value) {
  return /^\d+$/.test(value);
}

function getDefaultDoc(week_number) {
    return [
        {
            datetime: Date.now(),
            where: 'r11',
            week_number: week_number
        },
        {
            datetime: Date.now(),
            where: 'r12',
            week_number: week_number
        },
        {
            datetime: Date.now(),
            where: 'r31',
            week_number: week_number
        },
        {
            datetime: Date.now(),
            where: 'r3235',
            week_number: week_number
        },
        {
            datetime: Date.now(),
            where: 'linac',
            week_number: week_number
        },
        {
            datetime: Date.now(),
            where: 'spf',
            week_number: week_number
        }
    ];
}

function weekNumParamIsGood(week_number) {
    return !isInteger(week_number) || parseInt(week_number)>52
}

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
    const search_term = {archived: {$ne: true}};
    if (req.params.key !== 'all' | req.params.value !== 'all') {
        search_term[req.params.key] = req.params.value;
    }

    var functionStack = [];
    functionStack.push((callback) => {
        MaintenanceTask
            .find({archived: {$ne: true}})
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

    functionStack.push(function(callback) {
        if (req.params.value === "all") {
            callback(null, []);
        } else {
            AccessDetails
                .find({
                    'week_number': req.params.value
                })
                .sort({
                    where: 1
                })
                .exec(function(err, reports) {
                    if (err) return console.error(err);
                    var replies = [];
                    if (!Array.isArray(reports) || !reports.length) {
                        AccessDetails
                            .insertMany(getDefaultDoc(req.params.week_number))
                            .then(function(docs){
                                for (var i=0; i<docs.length; i++) {
                                    replies.push(docs[i])
                                }
                                callback(null, replies);
                            })
                            .catch(function(err) {
                                res.redirect('/bad-param');
                            });
                    }
                    else {
                        for (var i=0; i<reports.length; i++) {
                            replies.push(reports[i])
                        }
                        callback(null, replies);
                    }
                });
        }
        });

    async.parallel(
      functionStack,
      (err, data) => {
        if (err) console.error(error);
        var page_title;
        if (req.params.key === 'archived' & req.params.value === 'true') {
            page_title = 'MAX IV: Deleted Tasks';
        }
        else {
            page_title = 'MAX-IV: Maintenance Tasks';
        }
        res.render('list_all', {
            title: page_title,
            selected_week: req.params.value,
            linac_data: data[1].linac_data,
            linac_ids: data[1].linac_ids,
            other_data: data[1].other_data,
            other_ids: data[1].other_ids,
            r3_data: data[1].r3_data,
            r3_ids: data[1].r3_ids,
            spf_data: data[1].spf_data,
            spf_ids: data[1].spf_ids,
            r1_data: data[1].r1_data,
            r1_ids: data[1].r1_ids,
            week_numbers: data[0],
            reports: data[2]
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
  const spf_data = [];
  const spf_ids = [];
  for (let i = reports.length - 1; i >= 0; i--) {
    let report = reports.splice(i, 1)[0];
    if (taskShutsLinac(report)) {
      linac_data.push(dataToPush(report));
      linac_ids.push(report._id);
    }
    if (taskShutsR1(report)) {
      r1_data.push(dataToPush(report));
      r1_ids.push(report._id);
    }
    if (taskShutsR3(report)) {
      r3_data.push(dataToPush(report));
      r3_ids.push(report._id);
    }
    if (taskShutsSPF(report)) {
      spf_data.push(dataToPush(report));
      spf_ids.push(report._id);
    }
    if (taskForOther(report)) {
      other_data.push(dataToPush(report));
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
    spf_data,
    spf_ids,
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

function taskShutsSPF(report) {
  return report.where.includes('spf');
}

function taskForOther(report) {
  return report.where.includes('other');
}

/* POST a new maintenance task */
router.post('/new_maintenance_task', [
    body('location', 'You forgot to select a location').exists(),
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('new_task', {
              title: 'MAX-IV Maintenance Tasks',
              current_weeknumber: req.body.proposedweeknumber,
              firstname: req.body.first_name,
              lastname: req.body.last_name,
              responsible: req.body.fixer,
              starttime: req.body.starttime,
              endtime: req.body.endtime,
              comment: req.body.comment,
              error: errors.array()[0].msg
            });
            return;
        } else {
          const timestamp = Date.now();
          const fullname = req.body.first_name + " " + req.body.last_name;
          const fixer = req.body.fixer;
          const task = req.body.comment;
          const week_number = req.body.proposedweeknumber;
          const starttime = req.body.starttime;
          const endtime = req.body.endtime;
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
            starttime: starttime,
            endtime: endtime,
            approved: false,
            week_number: week_number
          });
          task_object.save(function(err) {
            if (err) {
              console.error(err);
            }
            res.redirect('/');
          });
        }
    }
  ]
);

router.post('/edit_maintenance_task', [
    sanitizeBody('*').trim().escape(),
    body('location', 'You forgot to select a location').exists(),
    body('location', 'You forgot to select a location').not().isEmpty(),
    function(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          res.render('new_task', {
            title: 'MAX-IV Maintenance Tasks',
            current_weeknumber: req.body.proposedweeknumber,
            firstname: req.body.first_name,
            lastname: req.body.last_name,
            responsible: req.body.fixer,
            starttime: req.body.starttime,
            endtime: req.body.endtime,
            comment: req.body.comment,
            error: errors.array()[0].msg
          });
          return;
      } else {
        const timestamp = Date.now();
        const fullname = req.body.first_name + " " + req.body.last_name;
        const fixer = req.body.fixer;
        const task = req.body.comment;
        const week_number = req.body.proposedweeknumber;
        const done = req.body.done==='done' ? true : false;
        const starttime = req.body.starttime;
        const endtime = req.body.endtime;
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

        const new_data = {
          datetime: timestamp,
          reporter: fullname,
          fixer: fixer,
          where: where,
          task: task,
          starttime: starttime,
          endtime: endtime,
          week_number: week_number,
          done: done
        };

        MaintenanceTask.findByIdAndUpdate(
          req.body.task_id,
          new_data,
          function(err, result) {
            if (err) console.error(err);
            res.redirect('/api/get/' + req.body.task_id);
          }
        );
      }
    }]
);

function dataToPush(report) {
  commentstr = report.task;
  if (commentstr.length > 55) {
    commentstr = commentstr.substring(0, 55) + '...';
  }
  return [
        report.week_number,
        report.reporter,
        report.where,
        report.fixer,
        report.starttime,
        report.endtime,
        report.approved ? 'Yes' : 'No',
        commentstr,
        report.done ? 'Yes' : 'No',
  ];
}

module.exports = router;
