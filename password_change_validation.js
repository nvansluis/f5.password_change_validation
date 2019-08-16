/*
 * Name: password_change_validation.js
 * Author: Niels van Sluis, <niels@van-sluis.nl>
 * Version: 1.0.1
 * Date: 2019-08-16
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
        document.getElementById("password_requirements").style.display = "block";
    }

    field1.onblur = function() {
        document.getElementById("password_requirements").style.display = "none";
    }

    field2.onfocus = function() {
        document.getElementById("password_match").style.display = "block";
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

        // keep the verify password input field disabled, until we got password that matches our password complexity policy
        if( document.getElementById("letter").getAttribute("class") == "valid" &&
            document.getElementById("capital").getAttribute("class") == "valid" &&
            document.getElementById("number").getAttribute("class") == "valid" &&
            document.getElementById("length").getAttribute("class") == "valid" ) {
            field2.disabled = false;
        }
        else {
            field2.disable = true;
        }

    }

    field2.onkeyup = function() {

        // Validate matching passwords
        var match  = document.getElementById("match");
        if(field1.value == field2.value) {
            match.classList.remove("invalid");
            match.classList.add("valid");
            logonButton.disabled = false;
        }
        else {
            match.classList.remove("valid");
            match.classList.add("invalid");
            logonButton.disabled = true;
        }
    }
}

/* select the table_footer that will hold the password validation messages */
var tableFooter = document.getElementById("credentials_table_footer");
tableFooter.style.cssText = 'vertical-align:top;';

/* add div that displays the password requirements */
var passwordRequirements = document.createElement('div');
passwordRequirements.style.cssText = 'position:relative;display:none;padding-left:15px;';
passwordRequirements.id = "password_requirements";
passwordRequirements.innerHTML += '<h3>Password must contain the following:</h3>';
passwordRequirements.innerHTML += '<p id="letter" class="invalid">&nbsp;&nbsp;A <b>lowercase</b> letter</p>';
passwordRequirements.innerHTML += '<p id="capital" class="invalid">&nbsp;&nbsp;A <b>capital</b> letter</p>';
passwordRequirements.innerHTML += '<p id="number" class="invalid">&nbsp;&nbsp;A <b>number</b></p>';
passwordRequirements.innerHTML += '<p id="length" class="invalid">&nbsp;&nbsp;Minimum <b>8 characters</b></p>';
tableFooter.appendChild(passwordRequirements);

/* add div that displays a message if the password matches or not */
var passwordMatch = document.createElement('div');
passwordMatch.style.cssText = 'position:absolute;display:none;padding-left:15px;';
passwordMatch.id = "password_match";
passwordMatch.innerHTML = '<h3>Password verification:</h3>';
passwordMatch.innerHTML += '<p id="match" class="invalid">&nbsp;&nbsp;Passwords match</p>';
tableFooter.appendChild(passwordMatch);

/* add css */
var style = document.createElement('style');
style.innerHTML = ''
+ '  #password_requirements p { '
+ '    //padding-left: 35px; '
+ '    font-size: 18px; '
+ '  } '
+ '  #password_match p { '
+ '    //padding-left: 35px; '
+ '    font-size: 18px; '
+ '  } '

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
