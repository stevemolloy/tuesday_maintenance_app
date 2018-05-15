var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FaultReportSchema = new Schema(
  {
    reporter: {type: String, required: true, max: 128},
    comment: [{type: Schema.ObjectId, ref: 'Comment'}],
    status: {type: String, default: 'Reported', max: 64},
    datetime: {type: Date, required: true},
  }
);

module.exports = mongoose.model('FaultReport', FaultReportSchema);
