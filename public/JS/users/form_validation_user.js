// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  const username = document.getElementById("username")
  const errorElement1 = document.getElementById("error1")
  const email = document.getElementById("email")
  const errorElement2 = document.getElementById("error2")
  const domains = document.getElementById("domains")
  const password = document.getElementById("password")
  const errorElement3 = document.getElementById("error3")
 
	
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
		let messages1 = []
		if(username.value==="") {
			messages1.push("Username is required.")
		}
		if(username.value&&!username.value.match(/^[a-zA-Z0-9_]*$/)) {
			messages1.push("Only letters (a-z or A-Z), numbers (0-9) and underscore (_) are allowed.")
		}
		if(username.value.match(/^[a-zA-Z0-9_]*$/)&&username.value.length>0&&username.value.length<3) {
			messages1.push("Username must be atleast 3 characters long.")
		}
		let messages2 = []
		if(email) { //if(email) is used bcoz login form does not have this field so this code will not run in case of login form. If we do not use this condition, this code will run for both login and register forms and bootstrap form validation will not work for login form, it will just work for register form.
			if(email.value==="") {
				messages2.push("Email address is required.")
			}
			if(email.value&&!email.checkValidity()) {
				messages2.push("Please enter a valid email address.")
				domains.textContent = "Domains allowed: hotmail.com/outlook.com/gmail.com/yahoo.com"
			}
	    }
		let messages3 = []
		if(password.value==="") {
			messages3.push("Password is required.")
		}
		if(password.value&&!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)) {
			messages3.push("Password must contain atleast 6 characters, including one uppercase and one lowercase letter, and one number.")
		} 
		  
		  
        if (!form.checkValidity()) {
          event.preventDefault()
		  errorElement1.textContent = messages1.join(', ')
		  if(email) { 
			  errorElement2.textContent = messages2.join(', ')  
		  }
		  errorElement3.textContent = messages3.join(', ')
		  username.addEventListener("input",function() {
			  if (username.value&&!username.value.match(/^[a-zA-Z0-9_]*$/)) {
   				  errorElement1.textContent = "Only letters (a-z or A-Z), numbers (0-9) and underscore (_) are allowed."
  			  } else if (username.value.match(/^[a-zA-Z0-9_]*$/)&&username.value.length>0                                              &&username.value.length<3) {
				  errorElement1.textContent = "Username must be atleast 3 characters long."
			  }
			    else if (!username.value) {
				  errorElement1.textContent = "Username is required."
			  } else {
				  errorElement1.textContent = ""
			  }
		  })
		  if(email) {
			  email.addEventListener("input",function() {
				  if (email.value&&!email.checkValidity()) {
					  errorElement2.textContent = "Please enter a valid email address."
					  domains.textContent = "Domains allowed: hotmail.com/outlook.com/gmail.com/yahoo.com"
				  } else if (!email.value) {
					  errorElement2.textContent = "Email address is required."
					  domains.textContent = ""
				  } else {
					  errorElement2.textContent = ""
					  domains.textContent = ""
				  }
			  })
		  }
		  password.addEventListener("input",function() {
			  if (password.value&&!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)) {
   				  errorElement3.textContent = "Password must contain atleast 6 characters, including one   uppercase and one lowercase letter, and one number."
  			  } else if (!password.value) {
				  errorElement3.textContent = "Password is required."
			  } else {
				  errorElement3.textContent = ""
			  }
		  })
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()