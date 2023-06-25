#include <SoftwareSerial.h>

#define rxPin 9  // Broche 4 en tant que RX, à raccorder sur TX du HC-05
#define txPin 8  // Broche 3 en tant que TX, à raccorder sur RX du HC-05
#define EnPin 2  // Broche 2 pour l'activation du HC-05

SoftwareSerial bt(rxPin, txPin);
String command = "";

void setup() {
  Serial.begin(38400);
  bt.begin(38400);
  pinMode(EnPin, OUTPUT);
  digitalWrite(EnPin, HIGH);
  delay(10);
  Serial.println("Enter AT commands");
}

void loop() {
  digitalWrite(EnPin, HIGH);

  if (Serial.available()>0) {
    bt.write(Serial.read());
  }
  if (bt.available()>0) {
    Serial.write(bt.read());
  }
}
