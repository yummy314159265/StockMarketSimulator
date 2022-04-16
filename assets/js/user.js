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



    const defaultlogin= {
        status: false,
        user: ''
    }

    var users = JSON.parse(localStorage.getItem("users") || "[]");
    var loggedin = JSON.parse(sessionStorage.getItem("loggedin")) || defaultlogin

    if(loggedin.status===false){
        logoutbutton.hide();
    } else {
        loginbutton.hide();
        signupbutton.hide();
    }

    //no duplicate usernames
    function checkRepeat(name){
        for(let i=0;i<users.length;i++){
            if(name===users[i].username){
                alert("Username already taken")
                return true;
            }
        }
        return false;
    }

    //check if passwords match
    function checkPassword(pass1,pass2){
        if(pass1!==pass2){
            // alert("Passwords do not match");
            errorMessgeEl.text("passwords do not match")
            errorMessgeEl.show();
            return true;
        }
        if(pass1.length<6){
        errorMessgeEl.text("password is too short! Must be 6 characters or longer")
        errorMessgeEl.show();
        return true;
        }
        if(!hasNumber(pass1)){
            errorMessgeEl.text("password must include number and special character")
            errorMessgeEl.show();
            return true;
        }
        if(!containsSpecialChars(pass1)){
            errorMessgeEl.text("password must include number and special character")
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
            console.log(name, pass, users[i].username, users[i].password)
            if(name===users[i].username && pass===users[i].password){
                console.log('found you!')
                return true;
            }
        }

        alert('You are not in our database hehe')
        return false;

    }

    function submitButtonHandler() {
        submitbutton.on('click',function(){
            event.preventDefault();
        
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
            alert("you have sucessfully created an account, you can now log in")
            succesMessgeEl.text("you did it you registere")
            succesMessgeEl.show();
            window.location.href="index.html";
            console.log(users);
        });
    }

    function loginButtonHandler() {
        login.on('click',function(){
            event.preventDefault();
            console.log(loggedin)
            if(loggedin.status===false){
            if(verifyUser(loginuser.val(),loginpass.val())){
                loggedin = {
                    status: true,
                    user: loginuser.val()
                }
                sessionStorage.setItem("loggedin",JSON.stringify(loggedin))
                logoutbutton.show();
                loginbutton.hide();
                signupbutton.hide();
            }
            else{
                alert("login failed")
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
            loggedin.status=false;
            loggedin.user='';
            sessionStorage.setItem("loggedin",JSON.stringify(loggedin))
            loginbutton.show()
            logoutbutton.hide()
            signupbutton.show()
            console.log("logout")
        })
    }

    function init_user() {
        submitButtonHandler();
        loginButtonHandler();
        logoutButtonHandler();
    }

    init_user();
}


quickFix();


export { quickFix }