enum FourPort {
    //% block="One"
    One = 1,
    //% block="Two"
    Two = 2,
    //% block="Three"
    Three = 3,
    //% block="Four"
    Four = 4
}

enum TwoPort {
    //% block="One"
    One = 1,
    //% block="Two"
    Two = 2,
}


/**
 * Blocks for Controlling a Hummingbird from a Micro:bit
 */
//% color=#169aa7 weight=32 icon="\uF0EB"
namespace hummingbird {
    let cmdBuff: Buffer
    let readBuff: Buffer
    let readyToSend: boolean
    readyToSend = false // to prevent sending or attempting to receive data until we have initialized the connection
    /**
     * Starts communication with the Hummingbird by redirecting serial to P14/P15, typically placed in "On Start"
     */
    //% weight=31 blockId="startHB" block="Start Hummingbird"
    export function startHummingbird(): void {
        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate115200)
        cmdBuff = pins.createBuffer(1)
        cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 88) // Ascii value of 'X'
        serial.writeBuffer(cmdBuff)
        readyToSend = true
    }

    /**
     * Sets an LED on ports 1 to 4 to a brightness value from 0 to 100
     * @param port the LED port to control [1-4]
     * @param brightness the % brightness of the LED [0-100]
     */
    //% weight=30 blockId="setLEDs" block="Set LED port %port_num| to %brightness |%"
    //%port_num.min=1 port_num.max=4
    //% brightness.min=0 brightness.max=100
    export function setLED(port: FourPort, brightness: number = 50): void {
        let timeout = 0
        while (!readyToSend && timeout < 25) {
            basic.pause(10)
            timeout++;
        }
        if (port >= 1 && port <= 4 && readyToSend) {
            //while(!readyToSend)
            //readyToSend=false
            let intensity = 0
            if (brightness > 100)
                brightness = 100
            if (brightness < 0)
                brightness = 0
            intensity = (brightness * 255) / 100
            let port_ascii = port + 47
            cmdBuff = pins.createBuffer(3)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 76) // Ascii value of 'L'
            cmdBuff.setNumber(NumberFormat.UInt8LE, 1, port_ascii)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 2, intensity)
            while (!readyToSend); // Wait for other functions in other threads
            readyToSend = false
            serial.writeBuffer(cmdBuff)
            readyToSend = true
        }
    }
    /**
     * Sets a Tri-color LED on ports 1 or 2 to the color specified by red, green, and blue brightness values. The values range from 0 to 100
     * @param port the LED port to control [1-2]
     * @param red_brightness the % brightness of the red LED element [0-100]
     * @param green_brightness the % brightness of the green LED element [0-100]
     * @param blue_brightness the % brightness of the blue LED element [0-100]
     */
    //% weight=29 blockId="setTriColorLEDs" block="Set Tri-LED port %port_num| with Red: %Red| Green: %Green | Blue: %Blue"
    //%port_num.min=1 port_num.max=2
    //% Red.min=0 Red.max=100
    //% Green.min=0 Green.max=100
    //% Blue.min=0 Blue.max=100
    export function setTriLED(port: TwoPort, red_brightness: number = 50, green_brightness: number = 0, blue_brightness: number = 50): void {
        let timeout = 0
        while (!readyToSend && timeout < 25) {
            basic.pause(10)
            timeout++;
        }
        if (port >= 1 && port <= 2 && readyToSend) {

            if (red_brightness > 100)
                red_brightness = 100
            if (red_brightness < 0)
                red_brightness = 0
            if (green_brightness > 100)
                green_brightness = 100
            if (green_brightness < 0)
                green_brightness = 0
            if (blue_brightness > 100)
                blue_brightness = 100
            if (blue_brightness < 0)
                blue_brightness = 0

            let port_ascii = port + 47
            red_brightness = red_brightness * 255 / 100
            green_brightness = green_brightness * 255 / 100
            blue_brightness = blue_brightness * 255 / 100

            cmdBuff = pins.createBuffer(5)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 79) // Ascii value of 'L'
            cmdBuff.setNumber(NumberFormat.UInt8LE, 1, port_ascii)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 2, red_brightness)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 3, green_brightness)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 4, blue_brightness)
            while (!readyToSend); // Wait for other functions in other threads
            readyToSend = false
            serial.writeBuffer(cmdBuff)
            readyToSend = true
        }
    }

    /**
     * Sets a servo on ports 1 to 4 to an angle from 0 to 180 degrees
     * @param port the servo port to control [1-4]
     * @param angle the angle in degrees for the servo [0-180]
     */
    //% weight=28 blockId="setServos" block="Set Servo port %port_num| to %angle |degrees"
    //%port_num.min=1 port_num.max=4
    //% angle.min=0 angle.max=180
    export function setServo(port: FourPort, angle: number = 90): void {
        let timeout = 0
        while (!readyToSend && timeout < 25) {
            basic.pause(10)
            timeout++;
        }
        if (port >= 1 && port <= 4 && readyToSend) {
            let angle_conv = 0
            if (angle > 180)
                angle = 180
            if (angle < 0)
                angle = 0

            angle_conv = (angle * 225) / 180
            let port_ascii = port + 47
            cmdBuff = pins.createBuffer(3)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 83) // Ascii value of 'S'
            cmdBuff.setNumber(NumberFormat.UInt8LE, 1, port_ascii)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 2, angle_conv)
            while (!readyToSend); // Wait for other functions in other threads
            readyToSend = false
            serial.writeBuffer(cmdBuff)
            readyToSend = true
        }
    }

    /**
     * Sets a motor on ports 1 or 2 to a speed from -100 to 100
     * @param port the motor port to control [1-2]
     * @param speed the speed of the motor [-100-100]
     */
    //% weight=27 blockId="setMotors" block="Set Motor port %port_num| to %speed |speed"
    //%port_num.min=1 port_num.max=2
    //% speed.min=-100 speed.max=100
    export function setMotor(port: TwoPort, speed: number = 90): void {
        let timeout = 0
        while (!readyToSend && timeout < 25) {
            basic.pause(10)
            timeout++;
        }
        if (port >= 1 && port <= 2 && readyToSend) {
            let direction = 48

            if (speed < -100)
                speed = -100
            if (speed > 100)
                speed = 100

            let abs_speed = speed * 255 / 100
            if (speed < 0) {
                direction = 49
                abs_speed = -abs_speed
            }

            let port_ascii = port + 47
            cmdBuff = pins.createBuffer(4)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 77) // Ascii value of 'M'
            cmdBuff.setNumber(NumberFormat.UInt8LE, 1, port_ascii)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 2, direction)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 3, abs_speed)
            while (!readyToSend); // Wait for other functions in other threads
            readyToSend = false
            serial.writeBuffer(cmdBuff)
            readyToSend = true
        }
    }

    /**
     * Sets a vibration motor on ports 1 or 2 to an intensity from 0 to 100
     * @param port the vibration motor port to control [1-2]
     * @param speed the intensity of vibration [0-100]
     */
    //% weight=26 blockId="setVibration" block="Set Vibration Motor port %port_num| to %intensity |%"
    //%port_num.min=1 port_num.max=2
    //% intensity.min=0 intensity.max=100
    export function setVibrationMotor(port: TwoPort, intensity: number = 50): void {
        let timeout = 0
        while (!readyToSend && timeout < 25) {
            basic.pause(10)
            timeout++;
        }
        if (port >= 1 && port <= 2 && readyToSend) {

            if (intensity < 0)
                intensity = 0
            if (intensity > 100)
                intensity = 100

            intensity = intensity * 255 / 100
            port = port + 47
            cmdBuff = pins.createBuffer(3)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 86) // Ascii value of 'M'
            cmdBuff.setNumber(NumberFormat.UInt8LE, 1, port)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 2, intensity)
            while (!readyToSend); // Wait for other functions in other threads
            readyToSend = false
            serial.writeBuffer(cmdBuff)
            readyToSend = true
        }
    }

    /**
     * Reads the value of the sensor on ports 1 to 4. Readings range from 0 to 100 and linearly correspond to a voltage from 0 to 5 volts on the sensor port
     * @param port the sensor port to read [1-4]
     */
    //% weight=20 blockId="getSensors" block="Get Sensor on port %port_num"
    //%port_num.min=1 port_num.max=4
    export function getSensor(port: FourPort): number {
        let timeout = 0
        while (!readyToSend && timeout < 25) {
            basic.pause(10)
            timeout++;
        }
        if (port >= 1 && port <= 4 && readyToSend) {
            let port_ascii = port + 47
            let return_val: number
            cmdBuff = pins.createBuffer(2)
            cmdBuff.setNumber(NumberFormat.UInt8LE, 0, 116) // Ascii value of 't'
            cmdBuff.setNumber(NumberFormat.UInt8LE, 1, port_ascii)
            while (!readyToSend); // Wait for other functions in other threads
            readyToSend = false
            serial.writeBuffer(cmdBuff)
            readBuff = pins.createBuffer(1)
            readBuff = serial.readBuffer(1)
            readyToSend = true
            return_val = (readBuff.getNumber(NumberFormat.UInt8LE, 0) * 100) / 255

            basic.pause(1)      // Pause added 1/21/20 to eliminate error

            return Math.round(return_val)
        }
        else {
            return 0
        }
    }
}