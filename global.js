
$(document).ready(function(e) {
    function addFooterContent() {
        // Do not add footer content if the user is on the OAuth2 login page.
        if (window.location.href.match(/.*\/login\/oauth2\//)) {
            return;
        }
        // Do not add footer content courses settings page.
        if (window.location.href.match(/\/courses\/\d+\/settings.*/)) {
            return;
          }
        // Do not add footer content on accounts settings page.
        if (window.location.href.match(/\/accounts\/\d+\/settings.*/)) {
            return;
        }

        const copyYear = new Date().getFullYear();

        const harvardCopy =
            "<div>Copyright &copy; 2014-" + copyYear + " The President and Fellows of Harvard College | " +
            '<a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=9d718485db0d57cc83a2f3f7bf961902" id="acceptable_use_policy_link" target="_blank">Acceptable Use Policy</a> | ' +
            '<a href="https://accessibility.harvard.edu/" id="accessibility_link" target="_blank">Accessibility</a> | ' +
            '<a href="https://accessibility.huit.harvard.edu/digital-accessibility-policy" id="digital_accessibility_link" target="_blank">Digital Accessibility</a> | ' +
            '<a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=3373044ddb4d57cc83a2f3f7bf961909" id="privacy_policy_link" target="_blank">Privacy Policy</a>' +
            "</div>";

        // Check for <footer> element on page.
        if ($("footer").length > 0) {
            // Select and replace the HTML content inside all <footer> element with the content of the `harvardCopy`.
            $("footer").html(harvardCopy);
        } else {
            // Create <footer> element.
            const harvardCopy2 =
            '<div id="custom-footer-container">' +
                '<footer role="contentinfo" id="hu-footer" class="ic-app-footer">' +
                    harvardCopy +
                "</footer>" +
            "</div>";

            // Append <footer> element to div content-wrapper element and make sure it is visible.
            $("#content-wrapper").append(harvardCopy2);
            $("#hu-footer").css("display", "block");
        }
    }
    addFooterContent();

  $("div.ic-Login-header__links > a#register_link").remove();

  $("#global_nav_dashboard_link").prop('href', '/');
  $(".ic-app-header__logomark").prop('href', '/');

  var login_body = $(".ic-Login__body").html();
  var hkey_link = `
    <div class="hu-hkey-login">
    Or, <a href="/login/saml" class="hu-hkey-login-link">log in with <img class="hu-hkey-logo" src="https://tlt-static-prod.s3.us-east-1.amazonaws.com/images/HarvardKeyLogo.png" alt="Harvard Key"/></a>
    <span class="hu-help-icon"><a href="#" onclick="$('.hu-hkey-help').toggle();"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" role="img" focusable="false" aria-label="Help for HarvardKey login">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
    </svg></a></span>
    </div>
    <div class="hu-hkey-help">
    <p>
    If you are a HarvardKey holder, you can use the link above to log in to Canvas.
    </p>
    <p>
    If you don't already have a HarvardKey, please continue to log in above with your email and password.
    </p>
    </div>
  `;
  $(".ic-Login__body").append(hkey_link);

  // for mobile:
  $('div.enrollment_link a#register_link').parent().html(hkey_link);

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

function initAddPronounText() {
    var windowUrl = window.location.pathname;
    var onProfileSettingsPage = (windowUrl.search(/\/profile\/settings/) != -1);

    if (onProfileSettingsPage) {
      var textSpan = $( "#pronouns" ).parent().children().last();

      textSpan.html("\
      <br/>This pronoun will appear after your name when enabled.\
      If you would like to do so, use this section to identify, \
      change, or delete your chosen personal pronouns. Currently \
      Canvas requires users to choose from a limited \
      prepopulated list of personal pronouns. We respect that \
      language is constantly evolving and members of our community \
      should be able to be called and describe their identity \
      however they choose, so we are working to enable that option \
      within Canvas. To learn more about gender, identity, \
      or pronouns and to provide feedback, visit: \
      <a href=\"https://dib.harvard.edu/gender-pronouns\" target=\"_blank\">\
      https://dib.harvard.edu/gender-pronouns</a>.\
      ");

      $( "#pronouns" ).parent().parent().children("th").css("vertical-align", "top");

    }
  }

$(document).ready(initAddPronounText);


// Start Pope Tech Accessibility Guide
var key='eiqAgTDWpCNYfArAmS29xHaBRNm1Agmb';(function(a){function b(a,b){var c=document.createElement("script");c.type="text/javascript",c.readyState?c.onreadystatechange=function(){("loaded"===c.readyState||"complete"===c.readyState)&&(c.onreadystatechange=null,b())}:c.onload=function(){b()},c.src=a,document.getElementsByTagName("head")[0].appendChild(c)}function c(a){return a&&("TeacherEnrollment"===a||"TaEnrollment"===a||"DesignerEnrollment"===a)}function d(){var a=window.location.pathname;return!!(-1!==a.indexOf("/edit")||-1!==a.indexOf("/new")||-1!==a.indexOf("/syllabus")||a.match(/\/courses\/[0-9]+\/pages\/?$/)||a.match(/\/courses\/[0-9]+\/?$/))}function e(){return f()||g()}function f(){var a=/\/courses\/[0-9]+\/pages\/?$/,b=window.location.pathname;return console.log("Check for pages url",window.location.pathname),console.log(a.test(b)),a.test(b)}function g(){var a=window.location.pathname;return console.log("Check for courses url",window.location.pathname),console.log("/courses"===a),"/courses"===a}function h(){var a=/\/accounts\/[0-9]+\/external_tools\/[0-9]+\/?$/,b=/\/courses\/[0-9]+\/external_tools\/[0-9]+\/?$/,c=window.location.pathname;return console.log("Check for external tool url",window.location.pathname),console.log(a.test(c)||b.test(c)),a.test(c)||b.test(c)}function i(f){for(var g=0;g<f.length;++g)if(localStorage.setItem(`${j}.${l}`,JSON.stringify(f)),c(f[g].type)){if(d()&&b("https://canvas-cdn.pope.tech/loader.min.js",function(){}),console.log("Key",a),null===a)break;(e()||h())&&(console.log("Load column"),b(`https://canvas-cdn.pope.tech/accessibility-column.min.js?key=${a}`,function(){}));break}}var j="pt-instructor-guide",k="username",l="enrollments";return-1===window.location.href.indexOf("/login/canvas")?-1===window.location.href.indexOf("?login_success=1")?void function(a,b){var c=localStorage.getItem(`${a}.${b}`);null===c?$.get("/api/v1/users/self/enrollments?type[]=DesignerEnrollment&type[]=TaEnrollment&type[]=TeacherEnrollment",function(a){i(a)}):(c=JSON.parse(c),i(c))}("pt-instructor-guide",l):(localStorage.removeItem(`${"pt-instructor-guide"}.${k}`),void $.get("/api/v1/users/self",function(a){localStorage.setItem(`${"pt-instructor-guide"}.${k}`,a.name)})):(localStorage.removeItem(`${"pt-instructor-guide"}.${k}`),localStorage.removeItem(`${"pt-instructor-guide"}.${"uuid"}`),localStorage.removeItem(`${"pt-instructor-guide"}.${"settings"}`),void localStorage.removeItem(`${"pt-instructor-guide"}.${l}`))})(key);
// End Pope Tech Accessibility Guide
