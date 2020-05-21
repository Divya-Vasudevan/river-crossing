// This #include statement was automatically added by the Particle IDE.
#include <neopixel.h>
#include <Particle.h>

#define PIXEL_PIN D3
#define PIXEL_COUNT 2
#define PIXEL_TYPE WS2812B

Adafruit_NeoPixel strip(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

String totemName = "totem1";
int trigPin = D2;    // Trigger
int echoPin = D4;    // Echo
long duration, cm;

int led = D7;
String status;
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
}
 
void loop() {
//button to check if selected that totem
    //lightUp();
    buttonState = digitalRead(buttonPin);
    if (buttonState == LOW) {
        if (ledState == HIGH) {
            lightOff();
            ledState = LOW;
        }
        else {
            lightOn();
            ledState = HIGH;
        }
        delay(200);
    }
    
    unsigned long currentMillis = millis();
    if(currentMillis - previousMillis >= 250) {
        if(status != "on Boat") {
            checkStatus();
            previousMillis = currentMillis;
        }
    }
  
}


void lightOn() {
     Particle.publish("getOnBoat", totemName, PUBLIC);
    for(int i = 0 ; i<11 ;i++) {
        strip.setPixelColor(i, 255, 0, 255);
    }
    strip.show();
}

void lightOff() {
    for(int i = 0 ; i<11 ;i++) {
        strip.setPixelColor(i, 0, 0, 0);
    }
    //strip.setPixelColor(4, 0, 0, 0);
    strip.show();
}

void checkStatus() { // to check if in south or north side
    digitalWrite(trigPin, LOW);
    delayMicroseconds(5);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH);
 
    // Convert the time into a distance
    cm = (duration/2) / 29.1;     // Divide by 29.1 or multiply by 0.0343
    if(cm<= 37 && cm >= 34) {
        status = "North";
    }  
    else if(cm <= 45 && cm >= 40) {
        status = "South";
    }
}