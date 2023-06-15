const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { timerGet, timerPost, timerDelete, timerPut } = require('./timerController');

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
app.delete('/timer/:id', timerDelete)
app.put('/timer/:id', timerPut)
app.get('/timer/session', (req, res) => {
    res.status(200).json(req.session.name);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
