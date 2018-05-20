var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    commenter: {type: String, required: true, max: 128},
    comment: {type: String, required: true, max: 1024},
    datetime: {type: Date, required: true},
  }
);

CommentSchema.methods.getCommenter = function() {
  return this.commenter;
}

CommentSchema.methods.getComment = function() {
  return this.comment;
}

CommentSchema.methods.getDateTime = function() {
  return this.datetime;
}

var FaultReportSchema = new Schema(
  {
    reporter: {type: String, required: true, max: 128},
    comment: [CommentSchema],
    status: {type: String, default: 'Reported', max: 64},
    datetime: {type: Date, required: true},
  }
);

FaultReportSchema.methods.getId = function () {
  return this._id;
}

FaultReportSchema.methods.getReporter = function () {
  return this.reporter;
}

FaultReportSchema.methods.getCommentId = function () {
  return this.comment;
}

FaultReportSchema.methods.getStatus = function () {
  return this.status;
}

FaultReportSchema.methods.getDateTime = function () {
  return this.datetime;
}

module.exports = {
  'FaultReport': mongoose.model('FaultReport', FaultReportSchema),
  'FaultComment': mongoose.model('FaultComment', CommentSchema)
};
