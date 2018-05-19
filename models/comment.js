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

module.exports = mongoose.model('Comment', CommentSchema);
