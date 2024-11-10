const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const { data_posts } = require('./data.js');

const express_app = express();
express_app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
express_app.use(express.json());
express_app.use(cookieParser());

const saltRounds = 3;
const delayLengthMS = 0; // used to simulate network delay if non-zero

const Post = mongoose.model("Post", {
	id: Number,
	title: String,
	author: String,
	created: Date,
	messages: [{
		body: String,
		author: String,
		created: Date
	}]
});

const User = mongoose.model("User", {
	username: String,
	realname: String,
	passhash: String
});

function authUser(req) {
	if (!req.app.locals.sessData) {
		return false;
	}
	if (req.cookies.username in req.app.locals.sessData && req.app.locals.sessData[req.cookies.username] == req.cookies.session) {
		return true;
	}
	return false;
}

express_app.get("/getposts", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	const page = ("page" in req.query) ? Math.max(req.query.page, 1) : 1;

	let fnd = {};
	fnd.posts = await Post.find({}, "title author created id -_id").sort({ created: -1 }).skip((page - 1) * 10).limit(10);
	fnd.numPages = Math.ceil(await Post.estimatedDocumentCount() / 10);

	res.send(fnd);
});

express_app.get("/getpost", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	if (!("post" in req.query)) {
		res.status(400).send("!DEV");
		return;
	}

	const postId = Math.max(req.query.post, 1);

	let fnd = await Post.findOne({ id: postId }, "-_id");
	if (fnd) {
		res.send(fnd);
	} else {
		res.sendStatus(404);
	}
});

express_app.post("/createpost", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}


	if (authUser(req)) {
		if (!(("postTitle" in req.body) && ("postBody" in req.body))) {
			res.status(400).send("!DEV");
			return;
		}

		let lastObj = (await Post.find({}, "id").sort({id: -1}).limit(1));
		let maxID = 1;
		if (lastObj.length > 0) {
			maxID = lastObj[0].id + 1;
		}

		let post = {
			id: maxID,
			title: req.body.postTitle,
			author: req.cookies.username,
			created: new Date(),
			messages: [{
				body: req.body.postBody,
				author: req.cookies.username,
				created: new Date()
			}]		
		};

		await Post.create(post);
		res.send({id: post.id});
	} else {
		res.status(401).send("Not logged in!");
	}
});


express_app.post("/deletepost", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	if (authUser(req)) {
		if ("postID" in req.body) {
			let fnd = await Post.findOne({ id: req.body.postID });
			if (fnd) {			
				if (req.cookies.username == fnd.author) {
					await Post.deleteOne({ id: fnd.id });
				} else {
					res.status(403).send("Could not authenticate!");
					return;
				}
				
			} else {
				res.sendStatus(404);
				return;
			}
		}
	} else {
		res.status(401).send("Not logged in!");
		return;
	}

	res.sendStatus(200);
});

express_app.post("/createpostreply", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	if (authUser(req)) {
		if (("postID" in req.body) && ("replyBody" in req.body)) {
			let fnd = await Post.findOne({ id: req.body.postID });
			if (fnd) {
				let curDate = new Date();

				let newFnd = {
					id: fnd.id,
					title: fnd.title,
					author: fnd.author,
					created: curDate,
					messages: []
				}

				fnd.messages.forEach(i => {
					newFnd.messages.push({
						body: i.body,
						author: i.author,
						created: new Date(i.created)
					})
				});

				newFnd.messages.push({
					body: req.body.replyBody,
					author: req.cookies.username,
					created: curDate
				});
				
				await Post.findOneAndUpdate({ id: fnd.id }, newFnd);
			} else {
				res.sendStatus(404);
				return;
			}
		}
	} else {
		res.status(401).send("Not logged in!");
		return;
	}

	res.sendStatus(200);
});

express_app.post("/signup", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	let hash = null;

	if (("username" in req.body) && ("password" in req.body) && ("realname" in req.body)) {
		let user = await User.findOne({ username: req.body.username }).exec();
		if (user == null) {
			hash = await bcrypt.hash(req.body.password, saltRounds);
		} else {
			res.status(400).send("Account with that username already exists!");
			return;
		}
	} else {
		res.status(400).send("!DEV");
		return;
	}

	await User.create({ username: req.body.username, realname: req.body.realname, passhash: hash });
	let session = uuidv4();
	if (!req.app.locals.sessData) {
		req.app.locals.sessData = {};
	}
	req.app.locals.sessData[req.body.username] = session;
	res.cookie("session", session);
	res.cookie("username", req.body.username);
	res.sendStatus(200);
});

express_app.post("/login", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	let hashMatched = null;

	if (("username" in req.body) && ("password" in req.body)) {
		let user = await User.findOne({ username: req.body.username }).exec();
		if (user != null) {
			hashMatched = await bcrypt.compare(req.body.password, user.passhash);
			if (!hashMatched) {
				res.status(400).send("Wrong password!");
				return;
			}
		} else {
			res.status(400).send("Account with that username does not exist!");
			return;
		}
	} else {
		res.status(400).send("!DEV");
		return;
	}

	let session = uuidv4();
	if (!req.app.locals.sessData) {
		req.app.locals.sessData = {};
	}
	req.app.locals.sessData[req.body.username] = session;
	res.cookie("session", session);
	res.cookie("username", req.body.username);
	res.sendStatus(200);
});

express_app.post("/logout", async (req, res) => {
	if (delayLengthMS > 0) {
		await new Promise(r => setTimeout(r, delayLengthMS));
	}

	if (authUser(req)) {
		req.app.locals.sessData[req.body.username] = null;
		res.clearCookie("session");
		res.clearCookie("username");
		res.sendStatus(200);
	} else {
		res.status(401).send("Not logged in!");
	}
});

async function init() {
	await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true");
	await Post.deleteMany({});
	await User.deleteMany({});
	await Post.insertMany(data_posts.slice(0, 27));
}
init().catch((err) => console.log(err));

express_app.listen(42370, () => {
	console.log("ready on http://localhost:42370");
});