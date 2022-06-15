//Following code is for counting number of characters inside textarea on new and edit pages for comments.

const textarea = document.querySelector("textarea")

const counterComment = document.getElementById("counter_comment")

counterComment.value = textarea.value.length+"/500"

textarea.addEventListener("input",()=>{
	counterComment.value = textarea.value.length+"/500"
})
