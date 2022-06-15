// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  const text = document.getElementById("text")
  const errorElement1 = document.getElementById("error1")
  const counterComment = document.getElementById("counter_comment")
 
	
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
		let messages1 = []
		if(text.value==="") {
			messages1.push("Please enter the comment.")
		}
		if(text.value&&text.value.trim().length===0) {
		//text.value.trim().length===0 is to check if the value has only spaces.
			text.value = ""
			counterComment.value = "0/500"
			messages1.push("Blank spaces are not allowed.")
		}
		  
		  
        if (!form.checkValidity()) {
          event.preventDefault()
		  errorElement1.textContent = messages1.join(', ')
		  text.addEventListener("input",function() {
			  if (text.value&&text.value.trim().length===0) {
				  text.value = ""
				  counterComment.value = "0/500"
   				  errorElement1.textContent = "Blank spaces are not allowed." 
  			  } else if (!text.value) {
				  errorElement1.textContent = "Please enter the comment."
			  } else {
				  errorElement1.textContent = ""
			  }
		  })
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()