#define BUTTON_PIN 4
#define LED_PIN 10
#include <SoftwareSerial.h>

#define rxPin 12 // Broche 11 en tant que RX, à raccorder sur TX du HC-05
#define txPin 11 // Broche 10 en tant que TX, à raccorder sur RX du HC-05
#define rxPin2 9
#define txPin2 8
#define EnPin 2
#define TRIG_PIN 3
#define ECHO_PIN 4
#define SPEAKER_PIN 5

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

#define TOLERANCE_CALIB 0.1
#define CPT_CALIB_MAX 25

#define TOLERANCE_MEASURE 0.05

#include <Ultrasonic.h>
Ultrasonic ultrasonic(TRIG_PIN, ECHO_PIN);
SoftwareSerial bt(rxPin, txPin);
#include <SoftwareSerial.h>

String command = "";
int startTimer = 0;
int cpt_calib = 0;
int dist_calib_temp = 0;
int dist_calib = 1000;

void setup()
{
  Serial.begin(38400);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  pinMode(rxPin2, INPUT);
  pinMode(txPin2, OUTPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  bt.begin(38400);
  // get return message from HC-06
}

void loop() {
  int dist = ultrasonic.read();
  if(Serial.available()>0){
    delay(20);
    while (Serial.available()>0)
    {
      command += (char)Serial.read();
    }
    bt.println("boutton : "+command);
    command = "";
  }
  else if (bt.available()>0)
  {
    while (bt.available()>0)
    {
      command += (char)bt.read();
    }
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
      startTimer = millis();
      bt.print("started");
      tone(SPEAKER_PIN, LA5, 1000);
      delay(1000);
      noTone(SPEAKER_PIN);
      startTimer = millis();
    }
    else if(command.startsWith("stop")){
      Serial.println(millis() - startTimer);
      bt.print("stopped");
      Serial.println(bt.getWriteError());
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
    command = "";
  }
  if (cpt_calib == 0 && (dist_calib < dist - (TOLERANCE_MEASURE * dist) || dist_calib > dist + (TOLERANCE_MEASURE * dist)))
  {
    dist_calib_temp = dist;
    cpt_calib++;
  }
  else if (cpt_calib < CPT_CALIB_MAX)
  {
    if (dist > (dist_calib_temp / cpt_calib) - TOLERANCE_CALIB * (dist_calib_temp / cpt_calib) && dist < (dist_calib_temp / cpt_calib) + TOLERANCE_CALIB * (dist_calib_temp / cpt_calib))
    {
      dist_calib_temp += dist;
      cpt_calib++;
    }
    else
    {
      cpt_calib = 0;
    }
    return;
  }
  else if (cpt_calib == CPT_CALIB_MAX)
  {
    dist_calib = dist_calib_temp / cpt_calib;
    cpt_calib++;
    // Serial.println("Calibration done at :" + String(dist_calib));
    tone(SPEAKER_PIN, DO, 500);
    delay(500);
    cpt_calib = 0;
  }
  // int freq = random(40, 5000);
  if (dist + (TOLERANCE_MEASURE * dist) < dist_calib && dist_calib != 0)
  {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    if (millis() - startTimer >= 50 && startTimer != 0)
    {
      Serial.println(millis() - startTimer);
      bt.print("stopped");
      Serial.println(bt.getWriteError());
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
  delay(10);
}
