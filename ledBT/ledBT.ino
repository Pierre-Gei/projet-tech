#define BUTTON_PIN 4
#define LED_PIN 10
#include <SoftwareSerial.h>
#include <AltSoftSerial.h>
#define rxPin 12  // Broche 11 en tant que RX, à raccorder sur TX du HC-05
#define txPin 11  // Broche 10 en tant que TX, à raccorder sur RX du HC-05
#define rxPin2 4
#define txPin2 3
#define TRIG_PIN 9
#define ECHO_PIN 8
#define SPEAKER_PIN 6

#define DO 261
#define RE 293
#define MI 329
#define FA 349
#define SOL 392
#define LA 440
#define SI 493

#define LA4 440
#define LA5 880

#define C5 523
#define B4 493
#define A4 440
#define F4 349

#include <Ultrasonic.h>
Ultrasonic ultrasonic(TRIG_PIN, ECHO_PIN);
SoftwareSerial bt(rxPin, txPin);
AltSoftSerial bt2(rxPin2, txPin2);

String command = "";
int startTimer = 0;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  pinMode(rxPin2, INPUT);
  pinMode(txPin2, OUTPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  Serial.println("ENTER AT Commands:");
  bt.begin(9600);
  bt2.begin(9600);
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
      tone(SPEAKER_PIN, F4, 250);
      delay(250);
      tone(SPEAKER_PIN, A4, 250);
      delay(250);
      tone(SPEAKER_PIN, B4, 250);
      delay(250);
      tone(SPEAKER_PIN, C5, 1000);
      delay(1000);
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
      tone(SPEAKER_PIN, LA4, 500);
      delay(500);
      noTone(SPEAKER_PIN);
      delay(500);
      tone(SPEAKER_PIN, LA4, 500);
      delay(500);
      noTone(SPEAKER_PIN);
      delay(500);
      tone(SPEAKER_PIN, LA4, 500);
      delay(500);
      noTone(SPEAKER_PIN);
      delay(500);
      tone(SPEAKER_PIN, LA5, 1000);
      delay(1000);
      noTone(SPEAKER_PIN);
      startTimer = millis();
    }
    
    command = "";
  }

  if(bt2.available()){
    while (bt2.available()) {
      command += (char)bt2.read();
    }
    command = "";
  }

  if (Serial.available()) {
    String userInput = Serial.readStringUntil('\n');  // Read user input
    if(userInput.startsWith("bt2")){
      userInput = userInput.substring(3);
      bt2.println(userInput);
    }
    else{
      bt.println(userInput);
    }
  }
  
  if (digitalRead(BUTTON_PIN) == 0) {
    Serial.println("bouton OK");
    bt.println("on");
  }
  
  delay(100);
}
