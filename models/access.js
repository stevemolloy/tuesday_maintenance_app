var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccessSchema = new Schema(
  {
    datetime: {type: Date, required: true},
    where: {type:String, max: 128},
    starttime: String,
    endtime: String,
    week_number: {type: Number},
  }
);

module.exports = {
  'AccessDetails': mongoose.model('AccessDetails', AccessSchema)
};
