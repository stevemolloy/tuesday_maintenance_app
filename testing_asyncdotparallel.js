const MaintenanceTask = require('./models/maintenanceTask').MaintenanceTask;
const async = require('async');
var mongoose = require('mongoose');
require('dotenv').config();

//Set up mongoose connection
var mongoDB = process.env.DBURL;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var functionStack = [];
functionStack.push((callback) => {
  MaintenanceTask
    .find({})
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
    .find({
      'week_number': 23
    })
    .exec((err, docs) => {
      if (err) throw callback(err);
      callback(null, docs);
    });
});

async.parallel(
  functionStack,
  function(err, data) {
    if (err) console.log(err);
    console.log(data);
    db.close();
  }
);
