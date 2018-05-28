var MaintenanceTask = require('../models/maintenanceTask').MaintenanceTask;

var express = require('express');
var router = express.Router();

router.get('/new_task', function(req, res, next) {
  res.render('new_task', {
    title: 'MAX-IV Maintenace Tasks'
  });
});

router.get('/', function(req, res, next) {
  MaintenanceTask
    .find({})
    .sort({
      datetime: -1
    })
    .exec(function(err, reports) {
      if (err) return console.error(err);
      var data = [];
      var ids = [];
      for (var i = 0; i < reports.length; i++) {
        var commentstr = reports[i].task;
        if (commentstr.length > 55) {
          commentstr = commentstr.substring(0, 55) + '...';
        }
        data.push([
          reports[i].datetime,
          reports[i].reporter,
          reports[i].where,
          commentstr
        ]);
        ids.push(reports[i]._id);
      }
      res.render('list_all', {
        title: 'MAX-IV Maintenance Tasks',
        data: data,
        ids: ids
      });
    });
});

/* POST a new maintenance task */
router.post('/new_maintenance_task', function(req, res, next) {
  var timestamp = Date.now();
  var fullname = req.body.first_name + " " + req.body.last_name;
  var fixer = '';
  var where = '';
  var task = req.body.comment;

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
    task: task
  });
  task_object.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
