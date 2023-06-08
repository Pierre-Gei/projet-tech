#define BUTTON_PIN 4
#define LED_PIN 10
#include <SoftwareSerial.h>
#include <AltSoftSerial.h>
#define rxPin 12 // Broche 11 en tant que RX, à raccorder sur TX du HC-05
#define txPin 11 // Broche 10 en tant que TX, à raccorder sur RX du HC-05
#define rxPin2 9
#define txPin2 8
#define EnPin 2
#define TRIG_PIN 3
#define ECHO_PIN 4
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

#define TOLERANCE_CALIB 0.1
#define CPT_CALIB_MAX 25

#define TOLERANCE_MEASURE 0.05

#include <Ultrasonic.h>
Ultrasonic ultrasonic(TRIG_PIN, ECHO_PIN);
SoftwareSerial bt(rxPin, txPin);
SoftwareSerial bt2(rxPin2,txPin2);

String command = "";
int startTimer = 0;
int cpt_calib = 0;
int dist_calib_temp = 0;
int dist_calib = 1000;

void setup()
{
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  pinMode(rxPin2, INPUT);
  pinMode(txPin2, OUTPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  pinMode(EnPin, OUTPUT);
  Serial.println("ENTER AT Commands:");
  bt.begin(115200);
  bt2.begin(9600);
  // get return message from HC-06
}

void loop()
{
  int dist = ultrasonic.read();
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
  digitalWrite(SPEAKER_PIN, HIGH);
  if (dist + (TOLERANCE_MEASURE * dist) < dist_calib && dist_calib != 0)
  {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    if (millis() - startTimer >= 50 && startTimer != 0)
    {
      Serial.println(millis() - startTimer);
      bt.println("stopped");
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
  Serial.println(bt.available());
  if (bt.available())
  {
    Serial.println("HC06: available");
    while (bt.available()>0)
    {
      Serial.print("HC06: read loop");
      command += (char)bt.read();
    }
    if (command != "")
    {
      Serial.print("HC06: received command: ");
      Serial.println(command);
      command = "";
    }
    // if (command.startsWith("on")) {
    //   digitalWrite(LED_PIN, HIGH);
    // }

    // if (command.startsWith("off")) {
    //   digitalWrite(LED_PIN, LOW);
    // }
    if (command.startsWith("start"))
    {
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
      bt.println("Started");
      tone(SPEAKER_PIN, LA5, 1000);
      delay(1000);
      noTone(SPEAKER_PIN);
    }

    command = "";
  }
  else if (bt2.available()>0)
  {
    while (bt2.available()>0)
    {
      Serial.print("HC05: read loop");
      command += (char)bt2.read();
    }
    Serial.println(command);
    if (command != "")
    {
      Serial.print("HC05: received command: ");
      Serial.println(command);
      command = "";
    }
  }

  if (Serial.available()>0)
  {
    command = Serial.readString();
    Serial.print(command);
    if (command.startsWith("bt1"))
    {
      // send to bt HC-06
      Serial.println("Send to HC06");
      bt.println(command.substring(3));
      delay(10);
    }
    else if (command.startsWith("bt2"))
    {
      // send to bt HC-05 if AT command, turn on EnPin else just send
      Serial.println("Send to HC05");
      command = command.substring(3);
      if (command.startsWith("AT"))
      {
        Serial.println("AT Command");
        digitalWrite(EnPin, HIGH);
        delay(100);
        bt2.println(command);
        delay(100);
        digitalWrite(EnPin, LOW);
        delay(10);
      }
      else
      {
        digitalWrite(EnPin, LOW);
        bt2.println(command);
      }
    }
    command = "";
  }
  delay(100);
}

// #define BUTTON_PIN 4
// #define LED_PIN 10
// #include <NeoSWSerial.h>
// #include <AltSoftSerial.h>
// #define rxPin 12  // Broche 11 en tant que RX, à raccorder sur TX du HC-05
// #define txPin 11  // Broche 10 en tant que TX, à raccorder sur RX du HC-05
// #define rxPin2 9
// #define txPin2 8
// #define EnPin 2
// #define TRIG_PIN 3
// #define ECHO_PIN 4
// #define SPEAKER_PIN 6

// #define DO 261
// #define RE 293
// #define MI 329
// #define FA 349
// #define SOL 392
// #define LA 440
// #define SI 493

// #define LA4 440
// #define LA5 880

// #define C5 523
// #define B4 493
// #define A4 440
// #define F4 349

// #define TOLERANCE_CALIB 0.1
// #define CPT_CALIB_MAX 25

// #define TOLERANCE_MEASURE 0.05

// #include <Ultrasonic.h>
// Ultrasonic ultrasonic(TRIG_PIN, ECHO_PIN);
// AltSoftSerial bt(rxPin, txPin);
// NeoSWSerial bt2(rxPin2, txPin2);

// String command = "";
// int startTimer = 0;
// int cpt_calib = 0;
// int dist_calib_temp = 0;
// int dist_calib = 1000;

// void setup() {
//   Serial.begin(9600);
//   pinMode(BUTTON_PIN, INPUT_PULLUP);
//   pinMode(LED_PIN, OUTPUT);
//   pinMode(rxPin, INPUT);
//   pinMode(txPin, OUTPUT);
//   pinMode(rxPin2, INPUT);
//   pinMode(txPin2, OUTPUT);
//   pinMode(SPEAKER_PIN, OUTPUT);
//   pinMode(EnPin, OUTPUT);
//   Serial.println("ENTER AT Commands:");
//   bt.begin(9600);
//   bt2.begin(9600);
//   bt.print("AT+RESET");
//   bt2.print("AT+RESET");
//   delay(1000);
//   digitalWrite(EnPin, HIGH);
//   bt2.println("AT+NAME?");
//   while (bt2.available()) {
//     Serial.write(bt2.read());
//   }
//   while (bt.available()) {
//     Serial.write(bt.read());
//   }
//   digitalWrite(EnPin, LOW);
// }

// void loop() {
//   int dist = ultrasonic.read();
//   if (cpt_calib == 0 && (dist_calib < dist - (TOLERANCE_MEASURE * dist) || dist_calib > dist + (TOLERANCE_MEASURE * dist))) {
//     dist_calib_temp = dist;
//     cpt_calib++;
//   } else if (cpt_calib < CPT_CALIB_MAX) {
//     if (dist > (dist_calib_temp / cpt_calib) - TOLERANCE_CALIB * (dist_calib_temp / cpt_calib) && dist < (dist_calib_temp / cpt_calib) + TOLERANCE_CALIB * (dist_calib_temp / cpt_calib)) {
//       dist_calib_temp += dist;
//       cpt_calib++;
//     } else {
//       cpt_calib = 0;
//     }
//     return;
//   } else if (cpt_calib == CPT_CALIB_MAX) {
//     dist_calib = dist_calib_temp / cpt_calib;
//     cpt_calib++;
//     //Serial.println("Calibration done at :" + String(dist_calib));
//     tone(SPEAKER_PIN, DO, 500);
//     delay(500);
//     cpt_calib = 0;
//   }
//   // int freq = random(40, 5000);
//   digitalWrite(SPEAKER_PIN, HIGH);
//   if (dist + (TOLERANCE_MEASURE * dist) < dist_calib && dist_calib != 0) {
//     digitalWrite(LED_PIN, HIGH);
//     delay(100);
//     digitalWrite(LED_PIN, LOW);
//     if (millis() - startTimer >= 50 && startTimer != 0) {
//       Serial.println(millis() - startTimer);
//       bt.println((millis() - startTimer));
//       tone(SPEAKER_PIN, F4, 250);
//       delay(250);
//       tone(SPEAKER_PIN, A4, 250);
//       delay(250);
//       tone(SPEAKER_PIN, B4, 250);
//       delay(250);
//       tone(SPEAKER_PIN, C5, 1000);
//       delay(1000);
//       startTimer = 0;
//     }
//   }

//   if (bt.available()) {
//     while (bt.available()) {
//       command += (char)bt.read();
//     }
//     Serial.println(command);
//     // if (command.startsWith("on")) {
//     //   digitalWrite(LED_PIN, HIGH);
//     // }

//     // if (command.startsWith("off")) {
//     //   digitalWrite(LED_PIN, LOW);
//     // }
//     if (command.startsWith("start")) {
//       tone(SPEAKER_PIN, LA4, 500);
//       delay(500);
//       noTone(SPEAKER_PIN);
//       delay(500);
//       tone(SPEAKER_PIN, LA4, 500);
//       delay(500);
//       noTone(SPEAKER_PIN);
//       delay(500);
//       tone(SPEAKER_PIN, LA4, 500);
//       delay(500);
//       noTone(SPEAKER_PIN);
//       delay(500);
//       tone(SPEAKER_PIN, LA5, 1000);
//       delay(1000);
//       noTone(SPEAKER_PIN);
//       startTimer = millis();
//     }

//     command = "";
//   }

//   if (Serial.available()) {
//     delay(10);
//     command = Serial.readString();
//     Serial.print(command);
//     if (command.startsWith("bt1")) {
//       //send to bt HC-06
//       bt.println(command.substring(3));
//       delay(10);
//     } else if (command.startsWith("bt2")) {
//       //send to bt HC-05 if AT command, turn on EnPin else just send
//       Serial.println("Send to HC05");
//       command = command.substring(3);
//       if (command.startsWith("AT")) {
//         Serial.println("AT Command");
//         digitalWrite(EnPin, HIGH);
//         delay(10);
//         bt2.println(command);
//         digitalWrite(EnPin, LOW);
//         delay(10);
//       } else {
//         digitalWrite(EnPin, LOW);
//         bt2.println(command);
//       }
//     }
//     command = "";
//   }

//   // Lire depuis le module HC-05 (bt2)
//   if (bt2.available()) {
//     while (bt2.available()) {
//       char c = bt2.read();
//       Serial.write(c);  // Afficher la réponse du module HC-05 dans le moniteur série
//     }
//     Serial.println();  // Nouvelle ligne pour séparer les réponses
//   }

//   // if (digitalRead(BUTTON_PIN) == 0) {
//   //   Serial.println("bouton OK");
//   //   bt.println("on");
//   // }

//   delay(100);
// }
