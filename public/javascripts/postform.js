function submit_report() {
  var d = new Date();
  var form = document.getElementById("report_form");
  var fullname = form.first_name.value + " " + form.last_name.value;
  var comment = form.comment.value;
  var status = "Reported";
  var timestamp = Date.now();



  console.log(comment);
}
