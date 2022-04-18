function quickFix() {

    function containsSpecialChars(str) {
        const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
    
        const result = specialChars.split('').some(specialChar => {
        if (str.includes(specialChar)) {
            return true;
        }
    
        return false;
        });
    
        return result;
    }
    function hasNumber(myString) {
        return /\d/.test(myString);
    }
    
    var username=$('#username');
    var password=$('#password');
    var passwordcheck=$('#confirm-password');
    var terms=$('#terms');
    var terms=$('#checkbox-agree-terms');
    var submitbutton=$('#submit');
    var login=$('#login');
    var loginuser=$('#loginname');
    var loginpass=$('#loginpass');
    var errorMessgeEl = $('#error-message');
    var succesMessgeEl = $('#success-message');
    var signupbutton=$('#signupbutton')
    var loginbutton=$('#login-button')
    var logoutbutton=$('#logoutbutton')

    var loginModal = $('#login-container')

    const defaultlogin=false;

    var users = JSON.parse(localStorage.getItem("users") || "[]");
    var loggedin = JSON.parse(sessionStorage.getItem("loggedin")) || defaultlogin;

    if(loggedin===false){
        logoutbutton.hide();
    } else {
        loginbutton.hide();
        signupbutton.hide();
    }

    //no duplicate usernames
    function checkRepeat(name){
        for(let i=0;i<users.length;i++){
            if(name===users[i].username){
                errorMessgeEl.text("This username is already taken. Please choose another name.")
                return true;
            }
        }
        return false;
    }

    //check if passwords match
    function checkPassword(pass1,pass2){
        if(pass1!==pass2){
            // alert("Passwords do not match");
            errorMessgeEl.text("Please verify and re-enter your password.")
            errorMessgeEl.show();
            return true;
        }
        if(pass1.length<6){
        errorMessgeEl.text("The password must be at least 6 characters long.")
        errorMessgeEl.show();
        return true;
        }
        if(!hasNumber(pass1)){
            errorMessgeEl.text("The password must contain at least one number.")
            errorMessgeEl.show();
            return true;
        }
        if(!containsSpecialChars(pass1)){
            errorMessgeEl.text("The password must contain at least one special character.")
            errorMessgeEl.show();
            return true;
        }
        else{
            return false;
        }
        
    }

    //create account
    function storeUser(){
        users.push({id: users.length, username: username.val(), password: password.val()});
        localStorage.setItem("users", JSON.stringify(users));
    }
    function checkbox(){
        if(terms[0].checked===false){
            return true;
        }
        else{
            return false;
        }
    }

    //login functionality
    function verifyUser(name,pass){
        for(let i=0;i<users.length;i++){
            if(name===users[i].username && pass===users[i].password){
                sessionStorage.setItem("userid",JSON.stringify(users[i].id));
                console.log('found you!')
                return true;
            }
        }
        $("#error-message-login").text("Invalid username or password, please verify your credentials!");        
        return false;

    }

    function submitButtonHandler() {
        submitbutton.on('click',function(){
            event.preventDefault();
            if(!document.getElementById("create-account-form").checkValidity())
            {
            document.getElementById("create-account-form").reportValidity();
            return false;
            }
        console.log(terms[0].checked)
            if(checkRepeat(username.val()))
                return;
            if(checkPassword(password.val(),passwordcheck.val()))
                return;   
            console.log('passed pass')
            if(checkbox())
                return;
            console.log('passed check')
            storeUser();
            console.log('were here')            
            
            errorMessgeEl.text('');            
            succesMessgeEl.show();
            $("#create-account-form").hide();
            
            console.log(users);
        });
    }

    function loginButtonHandler() {
        login.on('click',function(){
            event.preventDefault();
            if(loggedin===false){
            if(verifyUser(loginuser.val(),loginpass.val())){

                loggedin=true;
                sessionStorage.setItem("loggedin",JSON.stringify(loggedin));
               // location.reload();
               location.href = 'portfolio.html';

            }
            else{                
                $("#error-message-login").text("Invalid username or password, please verify your credentials!");
                return false;
            }
                loginModal.removeClass('is-active');
        
        }
            return;
        })
    }

    function logoutButtonHandler() {
        logoutbutton.on('click',function(){
            event.preventDefault();
            console.log(loginbutton)
            console.log(logoutbutton)
            console.log(signupbutton)
            loggedin=false;
            sessionStorage.setItem("loggedin",JSON.stringify(loggedin));
            console.log("logout")
            location.href = "index.html";
            //location.reload();
        })
    }

    function init_user() {
        submitButtonHandler();
        loginButtonHandler();
        logoutButtonHandler();
        succesMessgeEl.hide(); // hide
    }

    init_user();
}

quickFix();


export { quickFix }