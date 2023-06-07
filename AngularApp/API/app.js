// SERIAL PORT

const express = require('express');
const app = express();
const cors = require('cors');
const portListen = 3000;
const { ByteLengthParser } = require('@serialport/parser-byte-length')
const bodyParser = require('body-parser');
const {SerialPort} = require('serialport');

const port = new SerialPort({path:'COM5', baudRate: 9600 });
const parser = port.pipe(new ByteLengthParser({length: 8}));


let arduinoData = '';

app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));

app.get('/receive', (req, res) => {
    res.json({data: arduinoData});
});

parser.on ('data', (data) => {
    arduinoData = data.toString();
    console.log(arduinoData);
});

app.listen(portListen, () => {
    console.log(`Listening on port ${portListen}`)
})
