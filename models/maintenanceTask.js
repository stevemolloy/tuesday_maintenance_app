var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MaintenanceTaskSchema = new Schema(
  {
    datetime: {type: Date, required: true},
    reporter: {type: String, required: true, max: 128},
    fixer: {type: String, max: 128},
    where: {type:String, max: 128},
    task: {type: String, max: 8192},
    starttime: String,
    endtime: String,
    approved: Boolean,
    week_number: {type: Number},
    archived: Boolean
  }
);

module.exports = {
  'MaintenanceTask': mongoose.model('MaintenanceTask', MaintenanceTaskSchema)
};
