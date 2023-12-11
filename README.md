# Smart-Plant

## Brief description

Smart Plant is an innovative IoT solution designed to optimize plant irrigation. The solution utilizes the ESP32 microcontroller, runs on the RIOT OS, and integrates with the AWS ecosystem to enhance its functionality.

### Problem
Frequently, the question arises about the best watering frequency for plants. However, having too much information can be tricky, as there's a risk of overwatering or underwatering, which can harm the plant. Striking the right balance becomes crucial, blending irrigation science with careful observation and common sense. The goal is to maintain plant health by steering clear of both excess and water deficiency.

### Concept

### Component
#### Heltec LoRa 32 and Riot OS

![](/images/LORA32.png)
![](/images/riot_os.png)
### Sensors
- **Soil moisture** sensor monitors the level of humidity in the soil. This sensors provide valuable insights into the moisture content, allowing us to assess the plant's water needs accurately. By understanding the soil's moisture levels, we can implement more precise and efficient irrigation strategies, ensuring optimal conditions for plant growth.

![](/images/soil-moisture.png)

- **Water level** sensor checks that we have a sufficient amount of water in our tank for irrigating our plants. This ensures that when needed, the water pump will have an adequate supply for irrigation.
![](/images/water_level.jpg)

### Actuators
- **Water pump**
![](/images/water_pump.png) irrigates the plants. The activation of the water pump is initiated by a humidity sensor, triggered only when the plant's humidity drops below a specific threshold, which varies based on the type of plants.

### Blog Post

- [Blog Post]()

### Video

- [Video Presentation]()
