var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes in here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		//does user own the campground?
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				if(req.user._id.equals(foundCampground.author.id)){
					//if so, redirect
					next();
				} else {
					//if not, redirect
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}	
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentsOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		//does user own the comment?
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					//if so, redirect
					next();
				} else {
					//if not, redirect
					req.flash("error", "You don't have access to do that");
					res.redirect("back");
				}	
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		console.log("LoggedIn");
		return next();
	} 
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");

};

module.exports = middlewareObj;