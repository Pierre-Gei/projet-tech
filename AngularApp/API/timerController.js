const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://127.0.0.1:27017';

exports.timerGet = async function (req, res) {
    console.log("Get");
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("timers");
        let datas = await dbo.collection("timer").find({}).toArray();
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.timerPost = async function (req, res) {
    console.log("Post");
    let timer = req.body;
    console.log(timer);
    if (!timer) {
        res.status(400).json({ error: "Bad Data" });
        return;
    }
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("timers");
        let datas = await dbo.collection("timer").insertOne(timer);
        req.session.name = timer.name;
        req.session.nameId = datas.insertedId;
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.timerDelete = async function (req, res) {
    console.log("Delete");
    let id = req.params.id;
    console.log(id);
    if (!id) {
        res.status(400).json({ error: "Bad Data" });
        return;
    }
    
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("timers");
        let datas = await dbo.collection("timer").deleteOne({ _id: new mongodb.ObjectId(id) });
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.timerPut = async function (req, res) {
    console.log("Put");
    try {
        console.log("id " + req.params.id)
        console.log("timer " + JSON.stringify(req.body));
        db = await MongoClient.connect(url);
        let dbo = db.db("timers");
        let datas = await dbo.collection("timer").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: {time:req.body.time} });
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.timerGetById = async function (req, res) {
    console.log("GetById");
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("timers");
        let datas = await dbo.collection("timer").findOne({ _id: new mongodb.ObjectId(req.params.id) });
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


