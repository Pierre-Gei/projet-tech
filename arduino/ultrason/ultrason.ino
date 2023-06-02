#include "Ultrasonic.h"
Ultrasonic ultrasonic(9,8);

void setup() {
  Serial.begin(9600);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
}

void loop () {
  int dist = ultrasonic.read();
  digitalWrite(11,LOW);
  if (dist <= 80 || dist >=110) {
    Serial.println(dist);
    digitalWrite(11,HIGH);
  }

  delay(100);
}