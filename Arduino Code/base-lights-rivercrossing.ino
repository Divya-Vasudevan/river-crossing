// This #include statement was automatically added by the Particle IDE.
#include <neopixel.h>
#include <Particle.h>

#define PIXEL_PIN D3
#define PIXEL_PIN_S A0
#define PIXEL_COUNT 55
#define PIXEL_TYPE WS2812B


Adafruit_NeoPixel stripNorth(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);
Adafruit_NeoPixel stripSouth(PIXEL_COUNT, PIXEL_PIN_S, PIXEL_TYPE);

void setup() {
  stripNorth.begin();
  stripNorth.show();
  stripSouth.begin();
  stripSouth.show();
  Particle.function("lightError",lightError);
  Particle.function("lightWin",lightWin);
  Particle.function("lightNorth",lightNorth);
  Particle.function("lightSouth",lightSouth);
  Particle.function("lightOff",lightOff);
}
 
void loop() {
  
}


int lightError(String s) {
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 255, 0, 0);
        stripSouth.setPixelColor(i, 255, 0, 0);
    }
    for(int g=0;g<5;g++){
        for(int k = 0 ; k<stripNorth.numPixels() ;k++) {
            stripNorth.setPixelColor(k, 255, 0, 0);
            stripSouth.setPixelColor(k, 255, 0, 0);
        }
        stripNorth.show();
        stripSouth.show();
        delay(300);
        for(int j = 0 ; j<stripNorth.numPixels() ;j++) {
            stripNorth.setPixelColor(j, 0, 0, 0);
            stripSouth.setPixelColor(j, 0, 0, 0);
        }
        stripNorth.show();
        stripSouth.show();
        delay(300);
    }
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 255, 0, 0);
        stripSouth.setPixelColor(i, 255, 0, 0);
    }
    stripNorth.show();
    stripSouth.show();
    return 0;
}


int lightWin(String s) {
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 0, 255, 0);
        stripSouth.setPixelColor(i, 0, 255, 0);
    }
    for(int g=0;g<5;g++){
        for(int k = 0 ; k<stripNorth.numPixels() ;k++) {
            stripNorth.setPixelColor(k, 0, 255, 0);
            stripSouth.setPixelColor(k, 0, 255, 0);
        }
        stripNorth.show();
        stripSouth.show();
        delay(300);
        for(int j = 0 ; j<stripNorth.numPixels() ;j++) {
            stripNorth.setPixelColor(j, 0, 0, 0);
            stripSouth.setPixelColor(j, 0, 0, 0);
        }
        stripNorth.show();
        stripSouth.show();
        delay(300);
    }
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 0, 255, 0);
        stripSouth.setPixelColor(i, 0, 255, 0);
    }
    stripNorth.show();
    stripSouth.show();
    return 0;
}

int lightNorth(String s) {
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 0, 0, 255);
        stripSouth.setPixelColor(i, 0, 255, 0);
    }
    stripNorth.show();
    stripSouth.show();
    return 0;
}

int lightSouth(String s) { 
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 0, 255, 0);
        stripSouth.setPixelColor(i, 0, 0, 255);
    }
    stripNorth.show();
    stripSouth.show();
    return 0;
}

int lightOff(String s) {
    for(int i = 0 ; i<stripNorth.numPixels() ;i++) {
        stripNorth.setPixelColor(i, 0, 0, 0);
        stripSouth.setPixelColor(i, 0, 0, 0);
    }
    stripNorth.show();
    stripSouth.show();
    return 0;
}