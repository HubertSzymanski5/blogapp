
// add Express
const express = require("express");
const app = express();
// add express-sanitizer
const expressSanitizer = require("express-sanitizer");
// add body-parser
const bodyParser = require("body-parser");
// add mongoose
const mongoose = require("mongoose");
// add method-override
const methodOverride = require("method-override");

//------------
// APP CONFIG
//------------

// setup port
const PORT = 3000;
app.listen(PORT, () => {
	console.log("Server listen at port: " + PORT);
});
// setup mongoose
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
// serve custom stylesheets (scan "public" directory)
app.use(express.static("public"));
// use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// use express-sanitizer: AFTER use BODY PARSER !!!
app.use(expressSanitizer());
// set ejs as default
app.set("view engine", "ejs");
// define method-override pattern
app.use( methodOverride("_method") );

//-----------------------
// MONGOOSE/MODEL CONFIG
//-----------------------
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);

/*/ crazy posts
Blog.create({
	title: "Test Blog",
	image: "https://images.unsplash.com/photo-1557750505-e7b4d1c40410?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
	body: "Hello, this is a test post!"
}, (err, blog) => {
	if( !err ) {
		console.log("xD");
	}
});
//*/

//--------
// ROUTES
//--------

// lol homeee
app.get("/", (req, res) => {
	res.redirect("/blogs");
});

// INDEX -> GET "/blogs"
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err) {
			console.log("ERROR!");
		}
		else {
			res.render("index", {blogs: blogs.reverse()});
		}
	});
});

// NEW -> GET "/blogs/new"
app.get("/blogs/new", (req, res) => {
	res.render("new");
});

// CREATE -> POST "/blogs"
app.post("/blogs", (req, res) => {
	// sanitize and change
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// create blog
	Blog.create( req.body.blog, (err, newBlog) => {
		if( err ) {
			res.render("new");
		}
		else {
			// redirect to the index
			res.redirect("/blogs");
		}
	});
});

// SHOW -> GET "/blogs/:id"
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			// redirect to index page
			res.redirect("/blogs");
		}
		else {
			// show nice 
			res.render("show", {blog: foundBlog});
		}
	});
});

// EDIT -> GET "/blogs/:id/edit"
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById( req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect("/blogs");
		}
		else {
			res.render("edit", {blog: foundBlog});
		}
	});

});

// UPDATE -> PUT "/blogs/:id"
// rip, we need to fake it, cos HTML still doesn't support PUT xDDDD
app.put("/blogs/:id", (req, res) => {
	// sanitize and change
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// find element in database and update it
	// send ( id , newData, callbackFunction() )
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if( err ){
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DESTROY -> DELETE "/blogs/:id"
app.delete("/blogs/:id", (req, res) => {
	// destroy blog post
	Blog.findByIdAndRemove(req.params.id, err => {
		if( err ) {
			res.redirect("/blogs");
		}
		else {
			// redirect to index
			res.redirect("/blogs");
		}
	});
});

// not so RESTFUL now
app.get("/looves", (req, res) => {
	loves++;
	res.redirect("/blogs");
});
