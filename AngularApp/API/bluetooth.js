const WebSocket = require('ws');
const SerialPort = require('bluetooth-serial-port');
const bluetoothSerial = new SerialPort.BluetoothSerialPort();
const wss = new WebSocket.Server({ port: 8080 });
const targetDevice = '00:21:11:01:83:BB';
let isConnected = false;
let tabMacAddress = [];
let foundEventListener = null;
let finishedEventListener = null;

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('recu avant', message);
    message = message.toString('utf8');
    message = JSON.parse(message);
    console.log('received: ', message);

    if(message.message.trim() == ""){
      console.log("message vide");
      return;
    }
    if (message.message == 'connexion') {
      if (isConnected) {
        console.log("already connected");
        return;
      }
      tabMacAddress = [];

      const start = async () => {
        try {
          if(!foundEventListener || !finishedEventListener)
          await connectToBluetoothDevice();
          console.log("tabMacAddress" + tabMacAddress);
          // La fonction connectToBluetoothDevice est terminée, passer à la suite du code
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              message = { message: "connexion", tabMacAddress: tabMacAddress };
              client.send(JSON.stringify(message));
            }
          });
          cleanupBluetoothEventListeners();
        } catch (error) {
          console.error('Une erreur s\'est produite lors de la connexion Bluetooth :', error);
        }
      };

      start(); // Appeler la fonction start pour démarrer le processus
    }
    else if (message.message == 'start') {
      sendBluetoothMessage("start");
    }
    else if (message.message == 'isConnected') {

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          message = { message: "isConnected", isConnected: isConnected };
          client.send(JSON.stringify(message));
        }
      }
      );
    }
    else if (message.message == 'stop') {
      sendBluetoothMessage("stop");
    }
    else if (message.message == 'macAddress') {
      if (!isConnected) {
        let macAddress = message.macAddress;
        console.log("macAddress" + macAddress);
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
                message = { message: "isConnected", isConnected: isConnected };
                client.send(JSON.stringify(message));
              }
            });
          });
        });
      }
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

bluetoothSerial.on('data', function (data) {
  console.log('Bluetooth data received:', data);
  console.log('Bluetooth data received:', data.toString('utf8'));
  // Envoyer les données au client WebSocket
  const message = { message: data.toString('utf8') };
  if(message.message.trim() !== '' && message.message){
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
});

bluetoothSerial.on('closed', function () {
  console.log('Connexion Bluetooth fermée');
  isConnected = false;
  // Envoyer un message au client WebSocket pour indiquer la connexion Bluetooth fermée
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      message = { message: "isConnected", isConnected: isConnected };
      client.send(JSON.stringify(message));
    }
  }
  );
});


function connectToBluetoothDevice() {
  return new Promise((resolve, reject) => {
    if (isConnected) {
      console.log("already connected");
      return resolve();
    }

    foundEventListener = function (address, name) {
      const regex = /\(([^)]+)\)([\w\s]+)(\r)?/; // Expression régulière pour capturer le texte entre parenthèses et le nom

      const match = regex.exec(address);
      if (match) {
        const name = match[2];
        const macAddress = match[1];

        tabMacAddress.push({ name: name, macAddress: macAddress });
        console.log(tabMacAddress);
      } else {
        console.log("Aucune correspondance trouvée.");
      }
    };

    finishedEventListener = function () {
      console.log('Scan finished');
      return resolve();
    };

    bluetoothSerial.on('found', foundEventListener);
    bluetoothSerial.on('finished', finishedEventListener);

    bluetoothSerial.inquire();
  });
}

// Fonction pour nettoyer les écouteurs d'événements
function cleanupBluetoothEventListeners() {
  return new Promise((resolve, reject) => {
    if (foundEventListener) {
      bluetoothSerial.off('found', foundEventListener);
      foundEventListener = null;
    }

    if (finishedEventListener) {
      bluetoothSerial.off('finished', finishedEventListener);
      finishedEventListener = null;
      return resolve();
    }
    else {
      return reject();
    }
  });
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
