// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  const name = document.getElementById("name")
  const errorElement1 = document.getElementById("error1")
  const image = document.getElementById("image")
  const errorElement2 = document.getElementById("error2")
  const price = document.getElementById("price")
  const errorElement3 = document.getElementById("error3")
  const desc = document.getElementById("desc")
  const errorElement4 = document.getElementById("error4")
  const counterCampground = document.getElementById("counter_campground")
 
	
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
		let messages1 = []
		if(name.value==="") {
			messages1.push("Please enter campground's name.")
		}
		if(name.value&&!name.value.match(/^[a-zA-Z0-9][a-zA-Z0-9'\s]*$/)) {
			//Here ^ means beginning of string and $ means end of string
			messages1.push("Only letters (a-z or A-Z), numbers (0-9), spaces and apostrophe (') are allowed. First character cannot be space.")
		}
		let messages2 = []
		if(image.value==="") {
			messages2.push("Image URL is required.")
		}
		if(image.value&&!image.checkValidity()) {
			messages2.push("Please enter a valid https:// URL.")
		}
		let messages3 = []
		if(price.value==="") {
			messages3.push("Price is required.")
		}
		if(price.value&&!price.value.match(/^([1-9])$|^([1-9][0-9])$/)) {
			//Here ^ means beginning of string and $ means end of string
			messages3.push("Please enter price between $1 and $99.")
		}
		let messages4 = []
		if(desc.value==="") {
			messages4.push("Description is required.")
		}
		if(desc.value&&desc.value.trim().length===0) {
		//desc.value.trim().length===0 is to check if the value has only spaces.
			desc.value = ""
			counterCampground.value = "0/1500"
			messages4.push("Blank spaces are not allowed.")
		}
		  
		  
        if (!form.checkValidity()) {
          event.preventDefault()
		  errorElement1.textContent = messages1.join(', ')
		  errorElement2.textContent = messages2.join(', ')
		  errorElement3.textContent = messages3.join(', ')
		  errorElement4.textContent = messages4.join(', ')
		  name.addEventListener("input",function() {
			  if (name.value&&!name.value.match(/^[a-zA-Z0-9][a-zA-Z0-9'\s]*$/)) {
   				  errorElement1.textContent = "Only letters (a-z or A-Z), numbers (0-9), spaces and apostrophe (') are allowed. First character cannot be space."
  			  } else if (!name.value) {
				  errorElement1.textContent = "Please enter campground's name."
			  } else {
				  errorElement1.textContent = ""
			  }
		  })
		  image.addEventListener("input",function() {
			  if (image.value&&!image.checkValidity()) {
   				  errorElement2.textContent = "Please enter a valid https:// URL."
  			  } else if (!image.value) {
				  errorElement2.textContent = "Image URL is required"
			  } else {
				  errorElement2.textContent = ""
			  }
		  })
		  price.addEventListener("input",function() {
			  if (price.value&&!price.value.match(/^([1-9])$|^([1-9][0-9])$/)) {
   				  errorElement3.textContent = "Please enter price between $1 and $99."
  			  } else if (!price.value) {
				  errorElement3.textContent = "Price is required."
			  } else {
				  errorElement3.textContent = ""
			  }
		  })
		  desc.addEventListener("input",function() {
			  if (desc.value&&desc.value.trim().length===0) {
				  desc.value = ""
				  counterCampground.value = "0/1500"
   				  errorElement4.textContent = "Blank spaces are not allowed." 
  			  } else if (!desc.value) {
				  errorElement4.textContent = "Description is required."
			  } else {
				  errorElement4.textContent = ""
			  }
		  })
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()