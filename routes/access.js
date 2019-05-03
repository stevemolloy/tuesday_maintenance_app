var AccessDetails = require('../models/access').AccessDetails;
var currentWeekNumber = require('current-week-number');
var express = require('express');
var router = express.Router();
var async = require('async');
var { body,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

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
                    if (!Array.isArray(reports) || !reports.length) {
                        AccessDetails
                            .insertMany(getDefaultDoc(req.params.week_number))
                            .then(function(docs){
                                console.log('Rendering');
                                res.render(destination, {
                                    title: 'MAX-IV Maintenance Day Accesses',
                                    week_number: req.params.week_number,
                                    reports: docs
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

function timeChecker(time) {
    // console.log(!time.match("([01]?[0-9]|2[0-3]):[0-5][0-9]"));
    if (time === '') {
        return true;
    } else if (!time.match("([01]?[0-9]|2[0-3]):[0-5][0-9]")) {
        throw new Error("The input must be a time");
    } else {
        return true;
    }
}

router.post('/update/', [
    sanitizeBody('*').trim().escape(),
    body('r11start').optional().custom(timeChecker),
    body('r11end').optional().custom(timeChecker),
    body('r11beam').optional().custom(timeChecker),
    body('r12start').optional().custom(timeChecker),
    body('r12end').optional().custom(timeChecker),
    body('r12beam').optional().custom(timeChecker),
    body('r31start').optional().custom(timeChecker),
    body('r31end').optional().custom(timeChecker),
    body('r31beam').optional().custom(timeChecker),
    body('r3235start').optional().custom(timeChecker),
    body('r3235end').optional().custom(timeChecker),
    body('r3235beam').optional().custom(timeChecker),
    body('linacstart').optional().custom(timeChecker),
    body('linacend').optional().custom(timeChecker),
    body('linacbeam').optional().custom(timeChecker),
    body('spfstart').optional().custom(timeChecker),
    body('spfend').optional().custom(timeChecker),
    body('spfbeam').optional().custom(timeChecker),
    function(req, res, next) {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.redirect('/access/edit/' + req.body.week_number);
        }
        var functionStack = [];
        functionStack.push(function(callback) {
            AccessDetails
                .findByIdAndUpdate(req.body.linacid,
                    {'$set': {starttime: req.body.linacstart, endtime: req.body.linacend, readyforbeam: req.body.linacbeam }})
                .exec(function(err, docs) {
                    if (err) throw callback(err);
                    callback(null, null);
                });
        });
        functionStack.push(function(callback) {
            AccessDetails
                .findByIdAndUpdate(req.body.r11id,
                    {'$set': {starttime: req.body.r11start, endtime: req.body.r11end, readyforbeam: req.body.r11beam } })
                .exec(function(err, docs) {
                    if (err) throw callback(err);
                    callback(null, null);
                });
        });
        functionStack.push(function(callback) {
            AccessDetails
                .findByIdAndUpdate(req.body.r12id,
                    { '$set': { starttime: req.body.r12start, endtime: req.body.r12end, readyforbeam: req.body.r12beam } })
                .exec(function(err, docs) {
                    if (err) throw callback(err);
                    callback(null, null);
                });
        });
        functionStack.push(function(callback) {
            AccessDetails
                .findByIdAndUpdate(req.body.r31id,
                    { '$set': { starttime: req.body.r31start, endtime: req.body.r31end, readyforbeam: req.body.r31beam } })
                .exec(function(err, docs) {
                    if (err) throw callback(err);
                    callback(null, null);
                });
        });
        functionStack.push(function(callback) {
            AccessDetails
                .findByIdAndUpdate(req.body.r3235id,
                    { '$set': { starttime: req.body.r3235start, endtime: req.body.r3235end, readyforbeam: req.body.r3235beam } })
                .exec(function(err, docs) {
                    if (err) throw callback(err);
                    callback(null, null);
                });
        });
        functionStack.push(function(callback) {
            AccessDetails
                .findByIdAndUpdate(req.body.spfid,
                    { '$set': { starttime: req.body.spfstart, endtime: req.body.spfend, readyforbeam: req.body.spfbeam } })
                .exec(function(err, docs) {
                    if (err) throw callback(err);
                    callback(null, null);
                });
        });

        async.parallel(
            functionStack,
            function(err, data) {
                if (err) console.error(error);
                res.redirect('/summary/week_number/' + req.body.week_number);
            })
    }
]);

module.exports = router;
