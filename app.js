var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	Campground 		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	LocalStrategy 	= require("passport-local"),
	seedDB			= require("./seeds"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://KrisMale:Vnnstmem1234@yelpcampdeployment-pm2fz.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
	}).then(() => {
		console.log("connected to DB");
	}).catch(err => {
		console.log("ERROR:", err.message);
	});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //this seeds the database with campgrounds

// passport configuration
app.use(require("express-session")({
	secret: "Rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error =  req.flash("error");
	res.locals.success =  req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3001, function(req, res){
	console.log("YelpCamp listening on port 3001");
});