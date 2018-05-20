// var FaultComment = require('../models/comment');
var FaultReport = require('../models/faultreport').FaultReport;
var FaultComment = require('../models/faultreport').FaultComment;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/new_report', function(req, res, next) {
  res.render('new_report', {
    title: 'MAX-IV Fix List'
  });
});

router.get('/', function(req, res, next) {
  FaultReport
    .find({})
    .sort({
      datetime: -1
    })
    .exec(function(err, reports) {
      if (err) return console.error(err);
      var data = [];
      for (var i = 0; i < reports.length; i++) {
        var commentstr = reports[i].comment[0].getComment();
        if (commentstr.length > 55) {
          commentstr = commentstr.substring(0, 55) + '...';
        }
        data.push([
          reports[i].datetime,
          reports[i].reporter,
          commentstr
        ]);
      }
      res.render('list_all', {
        title: 'MAX-IV Fix List',
        data: data
      });
    });
});

/* POST a new fault */
router.post('/new_fault', function(req, res, next) {
  var fullname = req.body.first_name + " " + req.body.last_name;
  var commenttext = req.body.comment;
  var status = req.body.status;
  var timestamp = Date.now();

  var comment_obj = commentCreate(fullname, commenttext, timestamp);
  faultCreate(fullname, comment_obj, status, timestamp);

  res.redirect('/');
});

function commentCreate(commenter, comment, datetime) {
  commentdetail = {
    commenter: commenter,
    comment: comment,
    datetime: datetime
  };

  var comment = new FaultComment(commentdetail);

  comment.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Comment: ' + comment);
  });
  return comment;
}

function faultCreate(reporter, comment, status, datetime) {
  faultdetail = {
    reporter: reporter,
    comment: comment,
    status: status,
    datetime: datetime
  }

  var fault = new FaultReport(faultdetail);
  fault.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Fault: ' + fault);
  });
  return fault;
}

module.exports = router;
