const WebSocket = require('ws');
const SerialPort = require('bluetooth-serial-port');
const bluetoothSerial = new SerialPort.BluetoothSerialPort();
const wss = new WebSocket.Server({ port: 8080 });

let isConnected = false;

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    message = message.toString('utf8');
    console.log('received: ', message);

    if (message === 'connexion') {
      connectToBluetoothDevice();
    }
    if(message === 'start') {
      sendBluetoothMessage("start");
      console.log("start fddsf sd f");
    }
  });
});

bluetoothSerial.on('data', function (data) {
  console.log('Bluetooth data received:', data);

  // Envoyer les données au client WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data.toString('utf8'));
    }
  });
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
    if (!isConnected && macAddress === '00:21:11:01:83:BB') {
      // Se connecter à l'appareil Bluetooth spécifique
      console.log("youhou");
      bluetoothSerial.findSerialPortChannel(macAddress, function (channel) {
        console.log("channel" + channel);
        bluetoothSerial.connect(macAddress, channel, function () {
          console.log('Connected to: ' + macAddress);
          isConnected = true; // Marquer la connexion comme établie
          console.log("isConnected" + isConnected);

          // Envoyer un message au client WebSocket pour indiquer la connexion Bluetooth établie
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send('Connexion Bluetooth établie');
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
