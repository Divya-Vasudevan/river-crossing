// This #include statement was automatically added by the Particle IDE.
#include <neopixel.h>
#include <Particle.h>

#define PIXEL_PIN D3
#define PIXEL_COUNT 10
#define PIXEL_TYPE WS2812B

Adafruit_NeoPixel strip(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

String totemName = "totem3";
int trigPin = D2;    // Trigger
int echoPin = D4;    // Echo
long duration, cm;

int led = D7;
String status="north", prevStatus="north";
int buttonState = 0, ledState = 0;
int buttonPin = D6;

unsigned long previousMillis = 0; 
 
void setup() {
  strip.begin();
  strip.show();
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(led, OUTPUT);
    Particle.variable("cm",cm);
    Particle.variable("status",status);
    Particle.function("lightOn",lightOn);
    Particle.function("lightOff",lightOff);
}
 
void loop() {
    buttonState = digitalRead(buttonPin);
    if (buttonState == LOW) {
        checkStatus();
        Particle.publish("changeBoatState",totemName, PUBLIC);
        if (ledState == HIGH) {
            ledState = HIGH;
        }
        else {
            ledState = LOW;
        }
        delay(500);
    }
    
    unsigned long currentMillis = millis();
    if(currentMillis - previousMillis >= 2000) {
            checkStatus();
            previousMillis = currentMillis;
    }
  
}


int lightOn(String s) {
    for(int i = 0 ; i<11 ;i++) {
        strip.setPixelColor(i, 255, 0, 255);
    }
    strip.show();
    return 0;
}

int lightOff(String s) {
    for(int i = 0 ; i<11 ;i++) {
        strip.setPixelColor(i, 0, 0, 0);
    }
    strip.show();
    return 0;
}

void checkStatus() { 
    digitalWrite(trigPin, LOW);
    delayMicroseconds(5);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH);
 
    // Convert the time into a distance
    cm = (duration/2) / 29.1; 
    if(cm<= 4 && cm >= 1) {
        status = "south";
    }  
    else if(cm <= 25 && cm >= 10) {
        status = "north";
    }
    if(prevStatus != status) {
        Particle.publish("move",totemName, PUBLIC);;
    }
    prevStatus = status;
}