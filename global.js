
$(document).ready(function(e) {
  var copyYear = new Date().getFullYear();

  var harvardCopy = '<p>Copyright &copy; 2014-' + copyYear + ' The President and Fellows of Harvard College</p>&nbsp;';
  harvardCopy += '<p><a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=3373044ddb4d57cc83a2f3f7bf961909" id="privacy_policy_link" target="_blank">Privacy Policy</a> | <a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=9d718485db0d57cc83a2f3f7bf961902" id="acceptable_use_policy_link" target="_blank">Acceptable Use Policy</a></p>';
  $('footer').html(harvardCopy);

  $("div.ic-Login-header__links > a#register_link").remove();

  $("#global_nav_dashboard_link").prop('href', '/');
  $(".ic-app-header__logomark").prop('href', '/');

});
