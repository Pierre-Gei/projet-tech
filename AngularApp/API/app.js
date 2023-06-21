const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { timerGet, timerPost, timerDelete, timerPut, timerGetById } = require('./timerController');

const cors = require('cors');
const app = express();
const port = 3000;
app.use (session({
    secret : 'secret',
    name:'cookie',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));

app.get('/timer', timerGet);
app.post('/timer', timerPost);
app.delete('/timer/:id', timerDelete);
app.put('/timer/:id', timerPut);
app.get('/timer/session', (req, res) => {
    res.status(200).json({name:req.session.name, id:req.session.nameId});
});
app.post('/timer/session', (req, res) => {
    console.log("Coockie post")
    req.session.name = req.body.name;
    req.session.nameId = req.body.id;
    res.status(200).json({name:req.session.name, id:req.session.nameId});
    console.log("Cookie name " + req.session.name + "Cookie id " + req.session.nameId)
    
});
app.get('/timer/:id', timerGetById);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
