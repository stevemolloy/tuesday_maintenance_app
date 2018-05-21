var FaultReport = require('../models/faultreport').FaultReport;
var FaultComment = require('../models/faultreport').FaultComment;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('..');
});

router.get('/get/:faultId', function(req, res, next) {
  FaultReport
    .findOne({
      '_id': req.params.faultId
    })
    .exec(function(err, report) {
      if (err) return console.error(err);
      res.render('list_one', {
        title: 'MAX-IV Fix List',
        report: report
      });
    })
});

router.post('/get/:faultId/new_comment', function(req, res, next) {
  var commenter = req.body.first_name + " " + req.body.last_name;
  var comment = req.body.new_comment_text
  var datetime = Date.now();

  var comment_object = commentCreate(commenter, comment, datetime);

  FaultReport
    .findOne({
      '_id': req.params.faultId
    })
    .exec(function(err, report) {
      if (err) return console.error(err);
      report.comment.push(comment_object);
      report.save();
    });

  res.redirect('/api/get/' + req.params.faultId);
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

module.exports = router;
