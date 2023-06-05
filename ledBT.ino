#define BUTTON_PIN 4
#define LED_PIN 10
#include <SoftwareSerial.h>
#define rxPin 12  // Broche 11 en tant que RX, à raccorder sur TX du HC-05
#define txPin 11  // Broche 10 en tant que TX, à raccorder sur RX du HC-05
#define TRIG_PIN 9
#define ECHO_PIN 8
#define SPEAKER_PIN 6
#include <Ultrasonic.h>
Ultrasonic ultrasonic(TRIG_PIN, ECHO_PIN);
SoftwareSerial bt(rxPin, txPin);
String command = "";
int startTimer = 0;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  Serial.println("ENTER AT Commands:");
  bt.begin(9600);
}

void loop() {
  int dist = ultrasonic.read();
  // int freq = random(40, 5000);
  digitalWrite(SPEAKER_PIN, HIGH);
  digitalWrite(LED_PIN, LOW);
  if (dist <= 80) {
    digitalWrite(LED_PIN, HIGH);
    if(millis() - startTimer >= 100 && startTimer != 0){
      Serial.println(millis() - startTimer);
      bt.println((millis() - startTimer));
      tone(SPEAKER_PIN, 500, 250);
      startTimer = 0;

    }
  }
  
  if (bt.available()) {
    while (bt.available()) {
      command += (char)bt.read();
    }
    Serial.println(command);
    // if (command.startsWith("on")) {
    //   digitalWrite(LED_PIN, HIGH);
    // }
    
    // if (command.startsWith("off")) {
    //   digitalWrite(LED_PIN, LOW);
    // }
    if(command.startsWith("start")){
      startTimer = millis();
      tone(SPEAKER_PIN, 3000, 250);
    }
    
    command = "";
  }

  if (Serial.available()) {
    String userInput = Serial.readStringUntil('\n');  // Read user input
    bt.println(userInput);  // Send user input to the Bluetooth module
  }
  
  if (digitalRead(BUTTON_PIN) == 0) {
    Serial.println("bouton OK");
    bt.println("on");
  }
  
  delay(100);
}
