export type Template = {
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  estimated_cost: number;
  components: { name: string; quantity: number; voltage?: string; notes?: string }[];
  wiring_notes: string;
};

export const TEMPLATES: Template[] = [
  {
    slug: "smart-doorbell",
    title: "Smart Doorbell",
    description:
      "Wi-Fi doorbell using ESP32 + camera + push notification when someone presses the button.",
    difficulty: "intermediate",
    tags: ["esp32", "camera", "iot"],
    estimated_cost: 35,
    components: [
      { name: "ESP32-CAM", quantity: 1, voltage: "5V" },
      { name: "Push button", quantity: 1 },
      { name: "10k ohm resistor (pull-down)", quantity: 1 },
      { name: "5V power supply", quantity: 1, voltage: "5V" },
    ],
    wiring_notes:
      "GPIO 13 -> Push button -> GND\nGPIO 13 pulled down via 10k ohm to GND\n5V -> ESP32-CAM VCC\nGND shared",
  },
  {
    slug: "dog-feeder",
    title: "Automatic Dog Feeder",
    description:
      "Servo-driven feeder on a schedule. ESP32 dispenses food at programmed times.",
    difficulty: "beginner",
    tags: ["esp32", "servo", "automation"],
    estimated_cost: 25,
    components: [
      { name: "ESP32 DevKit v1", quantity: 1, voltage: "3.3V" },
      { name: "SG90 servo motor", quantity: 1, voltage: "5V" },
      { name: "External 5V power", quantity: 1, voltage: "5V" },
    ],
    wiring_notes:
      "GPIO 18 -> Servo signal\n5V supply -> Servo VCC\nGND shared between ESP32 and supply",
  },
  {
    slug: "motion-sensor",
    title: "Motion Sensor Alert",
    description:
      "PIR-triggered buzzer + LED. Great first project for learning interrupts.",
    difficulty: "beginner",
    tags: ["arduino", "pir", "sensor"],
    estimated_cost: 12,
    components: [
      { name: "Arduino Uno", quantity: 1, voltage: "5V" },
      { name: "HC-SR501 PIR sensor", quantity: 1, voltage: "5V" },
      { name: "Active buzzer", quantity: 1 },
      { name: "LED + 220 ohm resistor", quantity: 1 },
    ],
    wiring_notes:
      "PIR OUT -> D2\nBuzzer + -> D8\nLED anode -> D9 via 220 ohm -> GND\n5V/GND shared",
  },
  {
    slug: "plant-watering",
    title: "Plant Watering System",
    description:
      "Soil moisture sensor + relay + small pump. Water your plants automatically.",
    difficulty: "intermediate",
    tags: ["esp32", "relay", "garden"],
    estimated_cost: 30,
    components: [
      { name: "ESP32", quantity: 1, voltage: "3.3V" },
      { name: "Capacitive soil moisture sensor", quantity: 1, voltage: "3.3V" },
      { name: "5V relay module", quantity: 1, voltage: "5V" },
      { name: "Submersible 5V water pump", quantity: 1, voltage: "5V" },
    ],
    wiring_notes:
      "Sensor AOUT -> GPIO 34\nGPIO 12 -> Relay IN\nRelay COM -> Pump+\nNO -> 5V supply +\nPump- -> GND\nGround shared",
  },
  {
    slug: "camera-system",
    title: "Wi-Fi Camera System",
    description:
      "ESP32-CAM streaming MJPEG over local network with simple auth.",
    difficulty: "advanced",
    tags: ["esp32-cam", "streaming", "iot"],
    estimated_cost: 20,
    components: [
      { name: "ESP32-CAM", quantity: 1, voltage: "5V" },
      { name: "FTDI programmer", quantity: 1 },
      { name: "5V 2A power supply", quantity: 1, voltage: "5V" },
    ],
    wiring_notes:
      "FTDI TX -> ESP32 U0R\nFTDI RX -> ESP32 U0T\nIO0 -> GND for flashing\n5V/GND shared",
  },
];

export const findTemplate = (slug: string) => TEMPLATES.find((t) => t.slug === slug);
