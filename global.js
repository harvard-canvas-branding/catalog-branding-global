
if (window.ga && ga.loaded) {
    ga('create', 'UA-49649810-11', 'auto', 'huTracker');
    ga('huTracker.set', 'anonymizeIp', true);
    ga('huTracker.send', 'pageview');
}

$(document).ready(function(e) {
  var copyYear = new Date().getFullYear();

  var harvardCopy = '<div>Copyright &copy; 2014-' + copyYear + ' The President and Fellows of Harvard College | &nbsp</div>';
  harvardCopy += '<p><a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=9d718485db0d57cc83a2f3f7bf961902" id="acceptable_use_policy_link" target="_blank">Acceptable Use Policy</a> | ';
  harvardCopy += '<a href="https://accessibility.huit.harvard.edu/digital-accessibility-policy" id="accessibility_link" target="_blank">Accessibility</a> | ';
  harvardCopy += '<a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=3373044ddb4d57cc83a2f3f7bf961909" id="privacy_policy_link" target="_blank">Privacy Policy</a></p>';
  $('footer').html(harvardCopy);

  $("div.ic-Login-header__links > a#register_link").remove();

  $("#global_nav_dashboard_link").prop('href', '/');
  $(".ic-app-header__logomark").prop('href', '/');

  var login_body = $(".ic-Login__body").html();
  var hkey_link = "<div class=\"hu-hkey-login\">Or, <a href=\"/login/saml\">log in with <img class=\"hu-hkey-logo\" src=\"https://tlt-static-prod.s3.us-east-1.amazonaws.com/images/HarvardKeyLogo.png\" alt=\"Harvard Key\"/></a></div>";
  $(".ic-Login__body").html(login_body+hkey_link);

});



// code below from course_settings_add_school_detail.js in the canvas-branding-global repo.

var ACCOUNTS = [];
    var FETCH_OPTIONS = {
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json'
        }
    };

function fetchCourse(course_id) {
    return fetch("/api/v1/courses/" + course_id, FETCH_OPTIONS).then(handleResponse);
}

function fetchAccount(account_id) {
    return fetch("/api/v1/accounts/" + account_id, FETCH_OPTIONS).then(handleResponse);
}

function fetchCourseAccount(course) {
    return fetchAccount(course.account_id);
}

function fetchAccountParents(account) {
    ACCOUNTS.push(account);
    if (account.parent_account_id) {
        return fetchAccount(account.parent_account_id).then(fetchAccountParents);
    }
    return ACCOUNTS;
}

function handleResponse(response) {
    if(response.ok) {
        return response.json();
    }
    throw new Error('API request ' + response.url + ' failed with status code ' + response.status);
}

function getAccountsPath(accounts) {
    return accounts.slice().reverse().map(function(account) {
        return account.name;
    }).join(" > ");
}

function annotatePage(text, style) {
    style = style || {};
    style.color = style.color || "#000";
    style.backgroundColor = style.backgroundColor || "#ddd";
    var span, el = document.getElementById("course_account_id");
    if (el) {
        span = document.createElement("span");
        span.style.display = "block";
        span.style.color = style.color;
        span.style.backgroundColor = style.backgroundColor;
        span.style.padding = ".5em";
        span.style.marginBottom = "1em";
        span.appendChild(document.createTextNode(text));
        el.parentNode.appendChild(span);
    }
    return el;
}

function displayAccounts(accounts) {
    var text = getAccountsPath(accounts);
    annotatePage("Account: " + text) || alert(text);
    return accounts;
}

function handleError(errorObject) {
    var errorText = "Error: " + errorObject.message;
    console.log(errorObject);
    return errorObject;
}

function fetchAccountInfo() {
    var match = window.location.pathname.match(/^\/courses\/(\d+)/);
    var course_id = (match ? match[1] : null);
    if (course_id) {
        fetchCourse(course_id)
            .then(fetchCourseAccount)
            .then(fetchAccountParents)
            .then(displayAccounts)
            .catch(handleError);
    } else {
        var msg = "Please run this on a Canvas Course Settings page.";
        console.log(msg);
    }
}

function initAddSchoolDetail() {
  var reCourseSettingsPage = /courses\/.+?\/settings/;
  var windowUrl = window.location.pathname;
  var onCourseSettingsPage = (windowUrl.search(reCourseSettingsPage) != -1);

  if (onCourseSettingsPage) {
    fetchAccountInfo();
  }
}

$(document).ready(initAddSchoolDetail);
