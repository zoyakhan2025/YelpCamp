const express      = require("express"),
      router       = express.Router()
	  
// ROOT ROUTE
router.get("/",(req,res) => {
	res.render("landing");
})

// ROUTE404
router.all("*",(req,res) => {
	res.status(404).render("route404")
})

module.exports = router;


