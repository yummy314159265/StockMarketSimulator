var formEl = $('#create-account-form');
var firstNameEl = $('#first-name');
var lastNameEl = $('#last-name');
var dateOfBirthEl = $('#date-of-birth');
var phoneEl = $('#phone');
var emailEl = $('#email');
var usernameEl = $('#username');
var passwordEl = $('#password');
var agreeTermsEl = $('#checkbox-agree-terms');
var errorMessgeEl = $('#error-message');
var succesMessgeEl = $('#success-message');


var handleFormSubmit = function (event) {
    
    event.preventDefault();
    
    // get values
    var firstName = firstNameEl.val();
    var lastName = lastNameEl.val();
    var lastName = lastNameEl.val();
    var dateOfBirth = dateOfBirthEl.val();
    var phone = phoneEl.val();
    var email = emailEl.val();
    var username = usernameEl.val();
    var password = passwordEl.val();
    var chkTermAgree = agreeTermsEl.val();
    
    // validate each field
    if (!firstName || !lastName || !dateOfBirth || !phone || !email
        || !username || !password || !chkTermAgree) {          
      errorMessgeEl.text("Please fill in all the required fields.");
      $(':input[required]:visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    var userId = generateUserId();
    var userData = [{
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      phone: phone,
      email: email,
      username: username,
      password: password
    }];
    
    // store new or append
    
    storeInLocalStorage('dbusers', userData)
    succesMessgeEl.text("You have successfully registered with StockSimulator. You can now login.");
    // clear form
    formEl.html('');    
  };

  // store user information to local storage
  function storeInLocalStorage(item, keyAndvalue) {
    // fist user
    if (localStorage.getItem(item) == null) {
     localStorage.setItem(item, JSON.stringify(keyAndvalue));
     return;
     }
    // if users already exist, append
     var oldData = JSON.parse(localStorage.getItem(item)) || [];
     oldData.push(keyAndvalue);
     return;
  }
  
  // generate unique userId
  function generateUserId()
  {    
    
    var dbusers = JSON.parse(localStorage.getItem("dbusers"));         
    if(dbusers == null)
    {
       var userId = 1;
       return userId;
    }
    else{
      var totalUsers = dbusers.length;
      return ++totalUsers;        
    }
  }
  // form submit listener
  formEl.on('submit', handleFormSubmit);



