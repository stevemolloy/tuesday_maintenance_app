var FaultComment = require('../models/comment');
var FaultReport = require('../models/faultreport');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MAX-IV Fix List' });
});

router.post('/new_fault', function(req, res, next) {
  var fullname = req.body.first_name + " " + req.body.last_name;
  var commenttext = req.body.comment;
  var timestamp = Date.now();

  var comment_obj = commentCreate(fullname, commenttext, timestamp);
  faultCreate(fullname, comment_obj, "Reported", timestamp);
  res.send(req.body);
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
    // comments.push(comment)
    // cb(null, comment)
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
    // faults.push(fault)
    // cb(null, fault)
  });
  return fault;
}

module.exports = router;
