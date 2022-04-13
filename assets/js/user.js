
var username=$('#username');
var password=$('#password');
var passwordcheck=$('#confirm-password');
var terms=$('#terms');
var terms=$('input[id="terms"]');
var submitbutton=$('#submit');
var login=$('#login');
var loginuser=$('#loginname');
var loginpass=$('#loginpass');
 users = JSON.parse(localStorage.getItem("users") || "[]");

//no duplicate usernames
 function checkRepeat(name){
    for(let i=0;i<users.length;i++){
        if(name===users[i].username){
            alert("Username already exists");
            return true;
        }
    }
    return false;
 }

 //check if passwords match
 function checkPassword(pass1,pass2){
     if(pass1!==pass2){
        alert("Passwords do not match");
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
        console.log('chek the bocks')
        alert("You must agree to term of service!");
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
            console.log('found you!')
            return true;
        }
    }
    alert('You are not in our database hehe')
    return false;

}

submitbutton.on('click',function(){
  
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
    console.log(users);
});

login.on('click',function(){
    if(verifyUser(loginuser.val(),loginpass.val())){
        // i think we need to store a state and it would be 
        // {
        //     loggedin: true/false;
        // }
    }
    return;
})