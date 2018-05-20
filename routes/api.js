var FaultReport = require('../models/faultreport').FaultReport;
var FaultComment = require('../models/faultreport').FaultComment;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('..');
});

router.get('/:faultId', function(req, res, next) {
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

module.exports = router;
