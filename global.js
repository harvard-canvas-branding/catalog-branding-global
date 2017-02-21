$(document).ready(function(e) {
    var harvardCopy = '<p>Copyright &copy; 2017 The President and Fellows of Harvard College</p>';
    harvardCopy += '<p><a href="https://wiki.harvard.edu/confluence/display/canvas/Harvard+Privacy+Policy+for+Canvas" id="privacy_policy_link">Privacy Policy</a> | <a href="https://wiki.harvard.edu/confluence/display/canvas/Harvard+Acceptable+Use+Policy+for+Canvas" id="acceptable_use_policy_link">Acceptable Use Policy</a></p>';
    $('footer').html(harvardCopy);
});

$(document).ready(function() {
  $("#global_nav_dashboard_link").prop('href', '/');
  $(".ic-app-header__logomark").prop('href', '/');
});
