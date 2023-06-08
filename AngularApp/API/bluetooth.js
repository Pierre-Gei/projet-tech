const WebSocket = require('ws');
const SerialPort = require('bluetooth-serial-port');
const bluetoothSerial = new SerialPort.BluetoothSerialPort();
const wss = new WebSocket.Server({ port: 8080 });
const targetDevice = '00:21:11:01:83:BB';
let isConnected = false;

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('recu avant', message);
    message = message.toString('utf8');
    message = JSON.parse(message);
    console.log('received: ', message);

    if (message.message == 'connexion') {
      connectToBluetoothDevice();
    }
    if(message.message == 'start') {
      sendBluetoothMessage("start");
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected');
    isConnected = false;
  });
});

bluetoothSerial.on('data', function (data) {
  console.log('Bluetooth data received:', data);
  console.log('Bluetooth data received:', data.toString('utf8') );
  // Envoyer les données au client WebSocket
  const message = {
    message: data.toString('utf8'),
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
});

bluetoothSerial.on('closed', function () {
  console.log('Connexion Bluetooth fermée');
  isConnected = false;
});

function connectToBluetoothDevice() {
  if (isConnected) {
    console.log("already connected");
    return;
  }
  
  bluetoothSerial.on('found', function (address, name) {
    console.log(address);
    const macAddress = address.match(/\((.*?)\)/)[1];

    // Vérifier si c'est l'appareil Bluetooth spécifique que vous recherchez
    if (!isConnected && macAddress === targetDevice) {
      // Se connecter à l'appareil Bluetooth spécifique
      bluetoothSerial.findSerialPortChannel(macAddress, function (channel) {
        console.log("channel" + channel);
        bluetoothSerial.connect(macAddress, channel, function () {
          console.log('Connected to: ' + macAddress);
          isConnected = true; // Marquer la connexion comme établie
          console.log("isConnected" + isConnected);

          // Envoyer un message au client WebSocket pour indiquer la connexion Bluetooth établie
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send('"Connexion Bluetooth établie"');
            }
          });
        });
      });
    }
  });
  
  bluetoothSerial.on('finished', function () {
    console.log('Scan finished');
  });

 

  bluetoothSerial.inquire();
}

function sendBluetoothMessage(message) {
  if (!isConnected) {
    console.log("not connected");
    return;
  }

  bluetoothSerial.write(Buffer.from(message, 'utf8'), function (err, bytesWritten) {
    if (err) {
      console.error('Error sending Bluetooth message:', err);
    } else {
      console.log('Bluetooth message sent:', message);
    }
  });
}
