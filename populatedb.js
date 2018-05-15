#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}

var async = require('async')
var FaultComment = require('./models/comment')
var FaultReport = require('./models/faultreport')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var comments = []
var faults = []

function commentCreate(commenter, comment, datetime, cb) {
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
    comments.push(comment)
    cb(null, comment)
  });
}

function faultCreate(reporter, comment, status, datetime, cb) {
  faultdetail = {
    reporter: reporter,
    comment: comment,
    status: status,
    datetime: datetime
  }

  var fault = new FaultReport(faultdetail);
  fault.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Fault: ' + fault);
    faults.push(fault)
    cb(null, fault)
  }  );
}

function createComments(cb) {
  async.parallel([
      function(callback) {
        commentCreate('Steve Molloy', "A lovely comment", Date.now(), callback);
      },
      function(callback) {
        commentCreate('Lisa Lynch', "A nother lovely comment", Date.now(), callback);
      },
      function(callback) {
        commentCreate('Caitlin Molloy-Lynch', "My comments are the bestest", Date.now(), callback);
      },
      function(callback) {
        commentCreate('Rowan Molloy-Lynch', "But mine are the snyggäst!", Date.now(), callback);
      },
    ],
    // optional callback
    cb);
}

function createFaults(cb) {
    async.parallel([
        function(callback) {
          faultCreate(comments[0].commenter, comments[0], "Fixed", Date.now(), callback);
        },
        function(callback) {
          faultCreate(comments[1].commenter, comments[1], "Won't fix", Date.now(), callback);
        }
        ],
        // optional callback
        cb);
}

async.series([
    createComments,
    createFaults,
  ],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Hello World!');
      // console.log('BOOKInstances: '+bookinstances);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });
