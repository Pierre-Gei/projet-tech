const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

exports.timerGet = async function (req, res) {
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
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.timerDelete = async function (req, res) {
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
    let id = req.params.id;
    let timer = req.body;
    console.log(id);
    console.log(timer);
    if (!id || !timer) {
        res.status(400).json({ error: "Bad Data" });
        return;
    }
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("timers");
        let datas = await dbo.collection("timer").updateOne({ _id: new mongodb.ObjectId(id) }, { $set: timer });
        res.status(200).json(datas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


