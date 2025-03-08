import express from 'express';
const app = express();
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/a5',
    collection: 'sessiondata'
});

app.use(session({
    secret: 'some secret key here',
    resave: true,
    saveUninitialized: true
}))

app.use(function (req, res, next) {
    console.log(req.session);
    next();
});


app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "pug"); 

app.use(function(req,res,next){
	console.log(req.method);
	console.log(req.url);
	console.log(req.path);
	console.log(req.get("Content-Type"));
	next();
});

function notLoginError(req, res, next) {
    if (req.session.user == undefined) {
        return res.status(500).send('You are not login');
    }
    next();
}
function loginError(req, res, next) {
    if (req.session.user) {
          return res.status(500).send('You are already login!!!');
      }
      next();
  }

app.get("/", startPug);
app.get("/gallery", galleryPug);
app.get("/gallery/:id", gallery1Pug);
app.get("/workshops", workshopsPug);
app.get("/artists", artistsPug);
app.get("/search", searchPug);
app.get("/profile", profilePug);
app.get("/login", loginPug);
app.get("/register", loginError,registerPug);
app.put("/user",loginError, login);
app.post("/user", register);
app.post("/like", notLoginError,like);
app.post("/comment", notLoginError,comment);
app.get("/artists/:id", artistIndiv);
app.get("/workshops/:id", workshopIndiv);
app.post("/search", search);
app.delete("/like", del);
app.post("/workshop", addworkshop);
app.post("/gallery", addgallery);
app.get("/addWorkshop", addwpage);
app.get("/addGallery", addgpage);
app.put("/switchAcc", switchAcc);
app.put("/workshop",notLoginError, enroll);
app.put("/follow",notLoginError, follow);
app.put("/logout", logout);
app.delete("/follow", unfollow);
app.use((req, res, next) => {
    res.status(404).send('Sorry, the page you are looking for does not exist.');
});

async function unfollow(req, res) {
    let info = req.body;
    const result = await app.locals.notifications.deleteOne({"_id": new ObjectId(info._id)});
    res.status(200).send("Unfollowed");
}

async function logout(req, res) {
    req.session.user = undefined;
    res.status(200).send("Logged out successfully");
}

async function follow(req, res) {
    let info = req.body;
    info.enroll = [];
    const artist  = await app.locals.artists.findOne({"_id": new ObjectId(info._id)});
    console.log(artist)
    const result = await app.locals.notifications.insertOne({"followingid": new ObjectId(info._id), "following": artist.name, "name": req.session.user, notification: []});
    if (result) {
        res.status(200).send("follow successfully");
    } else {
        res.status(500).send("Failed to follow");
    }
}

async function enroll(req, res) {
    let info = req.body;
    info.enroll = [];
    const result = await app.locals.workshops.updateOne({"_id": new ObjectId(info._id)}, {$push: {"enroll": req.session.user}});
    if (result) {
        res.status(200).send("enroll successfully");
    } else {
        res.status(500).send("Failed to enroll");
    }
}

async function switchAcc(req, res){
    const user = await app.locals.users.findOne({"username": req.session.user});
    console.log(user)
    if(user.accType){
        const result = await app.locals.users.updateOne({"username": req.session.user}, {$set:{accType: false}});
        res.status(200).send("account switched to patrons!!")
    }else{
        const user = await app.locals.artists.findOne({"name": req.session.user});
        if(user){
            const result = await app.locals.users.updateOne({"username": req.session.user}, {$set:{accType: true}});
            res.status(200).send("account switched to artist!!")
        }else{
            res.status(500).send("account failed to switched!!")
        }
    }
}

function addwpage(req, res){
    res.render("./addworkshop");
}

function addgpage(req, res){
    res.render("./addgallery");
}

async function addworkshop(req, res) {
    let info = req.body;
    info.enroll = [];
    const result = await app.locals.workshops.insertOne(info);
    if (result) {
        const result = await app.locals.notifications.updateOne({"following": req.session.user}, {$push: {"notification":` Added Workshop:${info.name}` }});
        res.status(200).send("Added successfully");
    } else {
        res.status(500).send("Failed to add");
    }
}

async function addgallery(req, res) {
    let info = req.body;
    info.Artist = req.session.user;
    const result = await app.locals.gallery.insertOne(info);
    if (result) {
        const result = await app.locals.notifications.updateOne({"following": req.session.user}, {$push: {"notification":` Added Art:${info.Title}` }});
        const user = await app.locals.artists.findOne({"name": req.session.user});
        if(!user){const result = await app.locals.artists.insertOne({"name": req.session.user});}
        res.status(200).send("Added successfully");
    } else {
        res.status(500).send("Failed to add");
    }
}

async function del(req, res) {
    let info = req.body;
    const result = await app.locals.comments.deleteOne({"_id": new ObjectId(info._id)});
    console.log(result);
    if (result.deletedCount > 0) {
        res.status(200).send("Deleted successfully");
    } else {
        res.status(500).send("Failed to delete");
    }
}

async function search(req, res) {
    let info = req.body;
    const gallery = await app.locals.gallery.find(info).toArray();
    if (gallery[0] != undefined) {
        res.status(200).json(gallery);
    } else {
        res.status(500).send("Result not found");
    }
}

async function like(req, res) {   
    let info = req.body;
    const art = await app.locals.gallery.findOne({"_id": new ObjectId(info.artId)});
    info.userL = req.session.user;
    info.art = art.Title;
    info.like = true;
    const a = await app.locals.comments.insertOne(info);
    if (a) {
        res.status(200).send("Like added successfully!");
    } else {
        res.status(500).send("Like Failed");
    }
}


async function comment(req, res) {
    let info = req.body;
    const art = await app.locals.gallery.findOne({"_id": new ObjectId(info.artId)});
    info.userR = req.session.user;
    info.art = art.Title;
    info.like = false;
    const a = await app.locals.comments.insertOne(info);
    if (a) {
        res.status(200).send("Comment added successfully!");
    } else {
        res.status(500).send("Comment Failed");
    }
}

async function login(req, res) {
    let info = req.body;
    const accountMatch = await app.locals.users.findOne(info);
    if (accountMatch) {
        req.session.user = info.username;
        req.session.save();
        res.status(200).send("Logged in successfully!");
    } else {
        res.status(500).send("Login Failed");
    }
}

async function register(req, res) {
    let info = req.body;
    const accountMatch = await app.locals.users.findOne(info);
    if(accountMatch){
        res.status(500).send("User already exist!!");
        return;
    }
    const account= await app.locals.users.insertOne(info);
    if (account.acknowledged) {
        req.session.user = info.username;
        req.session.save();
        res.status(200).send("Registered Successfully!");
    } else {
        res.status(500).send("Registration Failed");
    }
}

function startPug(req, res){
    res.render("./start");
}

async function gallery1Pug(req, res){
    try{    const art = await app.locals.gallery.findOne({"_id": new ObjectId(req.params.id)});
        const reviews = await app.locals.comments.find({"art": art.Title, "like": false}).toArray();
        const l = await app.locals.comments.find({"art": art.Title, "like": true }).toArray();
        const artist = await app.locals.artists.findOne({"name" :art.Artist});
        const like = l.length;
        console.log(l)
        res.render("./art", {art, reviews, like, artist});}catch{res.status(404).send('Sorry, the page you are looking for does not exist.');}
}

async function artistIndiv(req, res){
    const artist = await app.locals.artists.findOne({"_id": new ObjectId(req.params.id)});
    const gallery = await app.locals.gallery.find({"Artist": artist.name}).toArray();
    res.render("./artistIndiv", {artist, gallery});
}

async function workshopIndiv(req, res){
    const workshop = await app.locals.workshops.findOne({"_id": new ObjectId(req.params.id)});

    res.render("./workshopIndiv", {workshop});
}

async function galleryPug(req, res){
    const artList = await app.locals.gallery.find().toArray();
    res.render("./gallery", {artList});
}

async function workshopsPug(req, res){
    const workshoplist = await app.locals.workshops.find().toArray();
    res.render("./workshops", {workshoplist});
}

async function artistsPug(req, res){
    const artistList = await app.locals.artists.find().toArray();
    res.render("./artists", {artistList});
}

function searchPug(req, res){
    res.render("./search");
}

async function profilePug(req, res){
    if(req.session.user == undefined){
        res.render("./start");
        return;
    }
    const user = await app.locals.users.findOne({"username" :req.session.user});
    const reviews = await app.locals.comments.find({"userR": req.session.user}).toArray();
    const like = await app.locals.comments.find({"userL": req.session.user}).toArray();
    const follows = await app.locals.notifications.find({"name": req.session.user}).toArray();
    res.render("./profile", {user, reviews, like, follows});
}

function loginPug(req, res){
    res.render("./login");
}

function registerPug(req, res){
    res.render("./register");
}

const databaseUrl = 'mongodb://localhost:27017/a5';

import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
let db = client.db("artgallery");
app.locals.gallery = db.collection("gallery");
app.locals.workshops = db.collection("workshop");
app.locals.artists = db.collection("artists");
app.locals.users = db.collection("users");
app.locals.comments = db.collection("comments");
app.locals.notifications = db.collection("notifications");

async function run() {
	try {
		
	} finally {
		console.log("Server listening at http://localhost:3000");
		app.listen(3000);

	}
}

run().catch(console.dir);