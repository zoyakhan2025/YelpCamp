//Following code is for index and show pages for campgrounds, if any image is broken on index and show page it will be replaced by a default image.
//-----------------------------------------------------------------------------------------
const img = document.querySelectorAll("img")

for(let i=0;i<img.length;i++) {
	img[i].addEventListener('error',()=>{
		img[i].src = "/Images/campground_default.webp"
	})
}
//Other important properties to test if the image exists or not are if(!img[i].complete) and if(img[i].naturalWidth===0).

//Following code is for counting number of characters inside textarea on new and edit pages for campgrounds.
//-----------------------------------------------------------------------------------------
const textarea = document.querySelector("textarea")

const counterCampground = document.getElementById("counter_campground")

if(counterCampground) {
//Wrapped the code in if() so this code will only run on new and edit pages else when run on other pages as well it will throw error due to missing elements.
	counterCampground.value = textarea.value.length+"/1500"

	textarea.addEventListener("input",()=>{
		counterCampground.value = textarea.value.length+"/1500"
	})
}

// Following code is for changing the background color of active pagination link
// --------------------------------------------------------------------------------------------------------
const paginationLinks = document.querySelectorAll(".page-link")
const hide = document.querySelector("#hide")

if(paginationLinks&&paginationLinks.length>0) {
	for(let i=1;i<=Number(hide.textContent);i++) {
		if(i<=4) {
			if(i===Number(hide.textContent)) {
				paginationLinks[i].style.background = "#dae0db"
			}
		} else {
			paginationLinks[4].style.background = "#dae0db"	
		}
	}
}





