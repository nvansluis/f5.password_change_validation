/*
 * Name: password_change_validation.js
 * Author: Niels van Sluis, <niels@van-sluis.nl>
 * Version: 1.0.2
 * Date: 2019-08-28
 *
 * Use the F5 APM Advanced Customization Editor and reference to this script from Common/footer.inc.
 *
 * For example:
 *
 *   <script src="https://www.van-sluis.nl/f5/scripts/password_change_validation.js"></script>
 *
 * Tested on version BIG-IP 15.0.0 Build 0.0.39 Final
 *
 */

/* The change password page contains two password input fields and the second input field is named _F5_verify_password */
if (document.getElementsByClassName("credentials_input_password").length == 2 &&
    document.getElementsByClassName("credentials_input_password")[1].getAttribute("name") == "_F5_verify_password") {
    var field1 = document.getElementsByClassName("credentials_input_password")[0];
    var field2 = document.getElementsByClassName("credentials_input_password")[1];
    var logonButton = document.getElementsByClassName("credentials_input_submit")[0];

    /* rename submit button from Logon to Change */
    logonButton.value = "Change";

    /* disable submit button */
    logonButton.disabled = true;

    /* disable verify password field */
    field2.disabled = true;

    field1.onfocus = function() {
        document.getElementById("password_complexity").style.display = "block";
    }

    field1.onblur = function() {
        //document.getElementById("password_requirements").style.display = "none";
        //document.getElementById("password_complexity").style.display = "none";
    }

    field2.onfocus = function() {
        document.getElementById("password_match").style.display = "block";
        document.getElementById("password_complexity").style.display = "none";
        //document.getElementById("password_requirements").style.display = "none";
    }

    field2.onblur = function() {
        document.getElementById("password_match").style.display = "none";
    }

    field1.onkeyup = function() {

        // Validate lowercase letters
        var letter = document.getElementById("letter");
        var lowerCaseLetters = /[a-z]/g;
        if(field1.value.match(lowerCaseLetters)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
        } else {
            letter.classList.remove("valid");
            letter.classList.add("invalid");
        }

        // Validate capital leters
        var capital = document.getElementById("capital");
        var upperCaseLetters = /[A-Z]/g;
        if(field1.value.match(upperCaseLetters)) {
            capital.classList.remove("invalid");
            capital.classList.add("valid");
        } else {
            capital.classList.remove("valid");
            capital.classList.add("invalid");
        }

        // Validate numbers
        var number = document.getElementById("number");
        var numbers = /[0-9]/g;
        if(field1.value.match(numbers)) {
            number.classList.remove("invalid");
            number.classList.add("valid");
        } else {
            number.classList.remove("valid");
            number.classList.add("invalid");
        }

        // Validate length
        var length  = document.getElementById("length");
        if(field1.value.length >= 8) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }

        var pcbar = document.getElementById("pcbar");

        // calculate password complexity progress bar
        var barWidth = 0;
        if( document.getElementById("letter").getAttribute("class") == "valid" ) {
          barWidth = barWidth + 25;
        }
        if( document.getElementById("capital").getAttribute("class") == "valid" ) {
          barWidth = barWidth + 25;
        }
        if( document.getElementById("number").getAttribute("class") == "valid" ) {
          barWidth = barWidth + 25;
        }
        if( document.getElementById("length").getAttribute("class") == "valid" ) {
          barWidth = barWidth + 25;
        }

        pcbar.style.width = barWidth + '%';
        if(barWidth > 0) {
          pcbar.innerHTML = barWidth + '%';
        }
        else {
          pcbar.innerHTML = '';
        }

        // keep the verify password input field disabled, until we got password that matches our password complexity policy
        if( document.getElementById("letter").getAttribute("class") == "valid" &&
            document.getElementById("capital").getAttribute("class") == "valid" &&
            document.getElementById("number").getAttribute("class") == "valid" &&
            document.getElementById("length").getAttribute("class") == "valid" ) {
            field2.disabled = false;
        }
        else {
            field2.disabled = true;
        }

    }

    field2.onkeyup = function() {

        // Validate matching passwords
        var match  = document.getElementById("match");
        var pmbar = document.getElementById("pmbar");
        if(field1.value == field2.value) {
            match.classList.remove("invalid");
            match.classList.add("valid");
            logonButton.disabled = false;
            pmbar.style.background = 'linear-gradient(to bottom, #0d8f34, #4CAF50)';
            pmbar.style.width = '100%';
            pmbar.innerHTML = '100%';
        }
        else {
            match.classList.remove("valid");
            match.classList.add("invalid");
            logonButton.disabled = true;

            pmbar.style.background = 'linear-gradient(to bottom, #fa8c05, red)';
            pmbar.style.width = '5%';
            pmbar.innerHTML = '';
        }
    }
}

/* select the table_footer that will hold the password validation messages */
var tableFooter = document.getElementById("credentials_table_footer");
tableFooter.style.cssText = 'vertical-align:top;';

/* set password requirements tooltip text */
var toolTip = 'Password must contain the following:';
toolTip += '<p id="letter" class="invalid">&nbsp;&nbsp;A <b>lowercase</b> letter</p>';
toolTip += '<p id="capital" class="invalid">&nbsp;&nbsp;A <b>capital</b> letter</p>';
toolTip += '<p id="number" class="invalid">&nbsp;&nbsp;A <b>number</b></p>';
toolTip += '<p id="length" class="invalid">&nbsp;&nbsp;Minimum <b>8 characters</b></p>';

/* add div that displays the password complicty progress bar */
var passwordComplexity = document.createElement('div');
passwordComplexity.style.cssText = 'position:relative;display:none;padding-left:15px;padding-right:20px;';
passwordComplexity.id = "password_complexity";
passwordComplexity.innerHTML += 'Password requirements:';
passwordComplexity.innerHTML += '<div id="pcprogress"><span class="tooltiptext">' + toolTip + '</span><div id="pcbar"></div></div>';
tableFooter.appendChild(passwordComplexity);

/* set password match tooltip text */
var pmToolTip = 'Password must match:';
pmToolTip += '<p id="match" class="invalid">&nbsp;&nbsp;Passwords match</p>';

/* add div that displays passsword match progress bar */
var passwordMatch = document.createElement('div');
passwordMatch.style.cssText = 'position:relative;display:none;padding-left:15px;padding-right:20px;';
passwordMatch.id = "password_match";
passwordMatch.innerHTML = 'Password verification:';
passwordMatch.innerHTML += '<div id="pmprogress"><span class="pmtooltiptext">' + pmToolTip + '</span><div id="pmbar"></div></div>';
tableFooter.appendChild(passwordMatch);

/* add css */
var style = document.createElement('style');
style.innerHTML = ''
+ '  #password_match p { '
+ '    //padding-left: 35px; '
+ '    margin: 0;'
+ '    font-size: 18px; '
+ '  } '
+ '  #pcprogress, #pmprogress { '
+ '    width: 85%; '
+ '    height: 21px; '
+ '    border: #c8c8c8 solid 1px; '
+ '    background-color: #ebebe4; '
+ '    border-radius: 3px; '
+ '    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); '
+ ' } '
+ '  #pcbar, #pmbar { '
+ '    width: 0%; '
+ '    height: 21px; '
+ '    background: linear-gradient(to bottom, #0d8f34, #4CAF50); '
+ '    border-radius: 3px; '
+ '    text-align: center; '
+ '    display: flex; '
+ '    display: -webkit-flex; '
+ '    align-items: center; '
+ '    justify-content: center; '
+ '    color: #f8f8f8; '
+ '    font-weight: bold; '
+ ' } '

+ '  .tooltip, .pmtooltip { '
+ '    position: relative; '
+ '    display: inline-block; '
+ '    border-bottom: 1px dotted black; '
+ '    } '

+ '  .tooltiptext { '
+ '    visibility: hidden; '
+ '    width: 200px; '
+ '    background-color: #f8f8f8; '
+ '    color: #000; '
+ '    text-align: left; '
+ '    padding: 5px 0; '
+ '    padding-left: 10px; '
+ '    border-radius: 6px; '
+ '    border: solid #c0c0c0 1px; '
+ '    position: absolute; '
+ '    z-index: 1; '
+ '    left: 85%; '
+ '    top: -70px; '
+ '    } '

+ '  .pmtooltiptext { '
+ '    visibility: hidden; '
+ '    width: 200px; '
+ '    background-color: #f8f8f8; '
+ '    color: #000; '
+ '    text-align: left; '
+ '    padding: 5px 0; '
+ '    padding-left: 10px; '
+ '    border-radius: 6px; '
+ '    border: solid #c0c0c0 1px; '
+ '    position: absolute; '
+ '    z-index: 1; '
+ '    left: 85%; '
+ '    top: 5px; '
+ '    } '

+ '  .tooltiptext::after, .pmtooltiptext::after { '
+ '    content: " "; '
+ '    position: absolute; '
+ '    top: 50%; '
+ '    right: 100%; '
+ '    margin-top: -5px;'
+ '    border-width: 5px;'
+ '    border-style: solid;'
+ '    border-color: transparent #c0c0c0 transparent transparent;'
+ '  } '

+ '  #pcprogress:hover .tooltiptext { '
+ '    visibility: visible; '
+ '    } '

+ '  #pmprogress:hover .pmtooltiptext { '
+ '    visibility: visible; '
+ '    } '

+ '  input[type="submit"][disabled] { '
+ '    border: 2px outset ButtonFace; '
+ '    color: GrayText; '
+ '    cursor: inherit; '
+ '    background-color: #ddd; '
+ '    background: #ddd; '
+ '  } '

+ '  /* Add a green text color and a checkmark when the requirements are right */ '
+ '  .valid { '
+ '    color: green; '
+ '  } '

+ '  .valid:before { '
+ '    position: relative; '
+ '    //left: -35px; '
+ '    content: "\\2714"; '
+ '  } '

+ '  /* Add a red text color and an "x" icon when the requirements are wrong */ '
+ '  .invalid { '
+ '    color: red; '
+ '  } '

+ '  .invalid:before { '
+ '    position: relative; '
+ '    //left: -35px; '
+ '    content: "\\2716"; '
+ '  } ';
document.head.appendChild(style);
