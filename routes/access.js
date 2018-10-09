var AccessDetails = require('../models/access').AccessDetails;
var currentWeekNumber = require('current-week-number');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:week_number', function(req, res, next) {
    AccessDetails
        .findOne({
            'week_number': req.params.week_number
        })
        .exec(function(err, report) {
            if (err) return console.error(err);
            res.send('Hello!');
        });
});

module.exports = router;
