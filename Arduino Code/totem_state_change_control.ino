int trigPin = D2;    // Trigger
int echoPin = D4;    // Echo
long duration, cm;

int led = D7;
String status;
int buttonState = 0, ledState = 0;
int buttonPin = D6;

unsigned long previousMillis = 0; 
 
void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(led, OUTPUT);
    Particle.variable("cm",cm);
    Particle.variable("status",status);
}
 
void loop() {
//button to check if selected that totem
    buttonState = digitalRead(buttonPin);
    if (buttonState == LOW) {
        if (ledState == HIGH) {
            digitalWrite(led,LOW);
            ledState = LOW;
            status = "off Boat";
        }
        else {
            digitalWrite(led,HIGH);
            ledState = HIGH;
            status = "on Boat";
        }
    }
    
    unsigned long currentMillis = millis();
    if(currentMillis - previousMillis >= 250) {
        if(status != "on Boat") {
            checkStatus();
            previousMillis = currentMillis;
        }
    }
  
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
    //cm= duration*0.034/2;
    if(cm<= 37 && cm >= 34) {
        status = "North";
    }  
    else if(cm <= 45 && cm >= 40) {
        status = "South";
    }
}