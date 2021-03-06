var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){
	
	// gets all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});
	
	//res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE - creates a new campground
router.post("/", middleware.isLoggedIn, function(req, res){
	
	// get data from form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {
		name: name, 
		image: image, 
		description: desc,
		price: price,
		author: author
	};
	
	// Create a new campground
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else {
		// redirect back to campgrounds page
		req.flash("success", "Great! You've created a new campground.");
		res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - show more details about one campground
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			req.flash("error", "Campground not found");
			console.log(err);
		}else {
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	//does user own the campground?
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update campgrounds route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error", "Ups, something went wrong");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "You've updated a campground");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// destroy campgrounds route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Campground could not be deleted");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "You have deleted a campground");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;