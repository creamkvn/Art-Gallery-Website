import info from './gallery.json'assert { type: 'json' };;

import { MongoClient } from "mongodb";
const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
async function run() {
  try {
    const db = client.db("artgallery");
    const gallery = db.collection("gallery");
    const workshops = db.collection("workshop");
    const artists = db.collection("artists");
    const users = db.collection("users");
    const comments = db.collection("comments");
    const notifications = db.collection("notifications");

    const dg = await gallery.drop();
    const du = await users.drop();
    const dc = await comments.drop();
    const dn = await notifications.drop();
    const da = await artists.drop();
    const dw = await workshops.drop();

    if(dg){
      console.log("Gallery collection dropped.")
    }
    if(du){
      console.log("Users collection ropped.")
    }
    if(dc){
      console.log("Comments collection dropped.")
    }
    if(dn){
      console.log("Notifications collection dropped.")
    }
    if(da){
      console.log("Artists collection dropped.")
    }
    if(dw){
      console.log("Workshops collection dropped.")
    }

    let a = {};
    let artist = [];
    let user = [];

    for(let i in info){
        a[info[i].Artist] = info[i].Artist;
    }
    
      for(let i in a){
        artist.push({"name": i});
        user.push({"username": i, "password": "iloveart", "accType": true});
      }

    const ig = await gallery.insertMany(info);
    const ia = await artists.insertMany(artist);
    const iu = await users.insertMany(user);

    console.log("Successfuly inserted " + ig.insertedCount + " art.");
    console.log("Successfuly inserted " + ia.insertedCount + " artists.");
    console.log("Successfuly inserted " + iu.insertedCount + " users.");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

