// tests go here; this will not be compiled when this package is used as a library

hummingbird.startHummingbird()

// Turn on at least one of every output, get one sensor value
input.onButtonPressed(Button.A, () => {
    let sensor_val = hummingbird.getSensor(1)
    hummingbird.setLED(1, sensor_val)
    hummingbird.setTriLED(2, 50, 50, 50)
    hummingbird.setServo(1, 180)
    hummingbird.setMotor(2, -100)
    hummingbird.setVibrationMotor(1, 35)
    basic.showNumber(sensor_val)
})

// Turn off all outputs, set servo to 0 degrees
input.onButtonPressed(Button.B, () => {
    hummingbird.setLED(1, 0)
    hummingbird.setTriLED(2, 0, 0, 0)
    hummingbird.setServo(1, 0)
    hummingbird.setMotor(2, 0)
    hummingbird.setVibrationMotor(1, 0)
})

// Check if the motor also goes in the other direction
input.onButtonPressed(Button.AB, () => {
    hummingbird.setMotor(2, 100)
})