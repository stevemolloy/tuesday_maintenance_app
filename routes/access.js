var AccessDetails = require('../models/access').AccessDetails;
var currentWeekNumber = require('current-week-number');
var express = require('express');
var router = express.Router();

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

var getData = function(destination) {
    return function(req, res, next) {
        if (weekNumParamIsGood(req.params.week_number)) {
            res.redirect('/bad-param');
        }
        else {
            AccessDetails
                .find({
                    'week_number': req.params.week_number
                })
                .sort({
                    where: 1
                })
                .exec(function(err, reports) {
                    if (err) return console.error(err);
                    if (!reports || reports.length===0) {
                        AccessDetails.insertMany(getDefaultDoc(req.params.week_number))
                            .then(function(docs){
                                res.render(destination, {
                                    title: 'MAX-IV Maintenance Day Accesses',
                                    week_number: req.params.week_number
                                });
                            })
                            .catch(function(err) {
                                res.redirect('/bad-param');
                            });
                    }
                    else {
                        res.render(destination, {
                            title: 'MAX-IV Maintenance Day Accesses',
                            week_number: req.params.week_number,
                            reports: reports
                        });
                    }
                });
        }
    }
}

router.get('/edit/:week_number', getData('accessedit'));

router.get('/:week_number', getData('accessview'));

router.get('/update/:phase/:id/:time', function(req, res, next) {
    AccessDetails
        .findOne({
            '_id': req.params.id
        })
        .exec(function(err, report) {
            if (err) return console.error(err);
            if (req.params.phase==="start") {
                AccessDetails
                    .update(
                        { _id: report.id },
                        { $set: { starttime: req.params.time }},
                        function(err, raw) {
                            if (err) return console.error(err);
                            res.redirect('/access/edit/' + report.week_number)
                        });
            } else if (req.params.phase==="end") {
                AccessDetails
                    .update(
                        { _id: report.id },
                        { $set: { endtime: req.params.time }},
                        function(err, raw) {
                            if (err) return console.error(err);
                            res.redirect('/access/edit/' + report.week_number)
                        });
            } else {
                res.redirect('/access/edit/report.week_number');
            }
        });
});

module.exports = router;
