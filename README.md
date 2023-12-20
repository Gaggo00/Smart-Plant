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
- **Water pump** irrigates the plants. The activation of the water pump is initiated by a humidity sensor, triggered only when the plant's humidity drops below a specific threshold, which varies based on the type of plants.

![](/images/water_pump.png) 
### AWS ecosystem
The details collected by the two sensors are sent to the AWS system, allowing us to continuously monitor the plant's status. AWS IoT Core ensures secure communication between the ESP32 board and the cloud, where the information is securely stored in Amazon DynamoDB. Real-time data processing is carried out by AWS Lambda functions. Amazon API Gateway provides a secure website for users to monitor and control the system, and AWS Amplify simplifies the creation of a user-friendly app. All in all, these services ensure a seamless connection for the smart Plant project, enabling real-time data analysis, access control, and an improved user experience.
![](/images/network_architecture.jpg)

### Irrigation: Optimal Growth with Bottom Watering
In the Smart Plant system, we prioritize bottom watering to ensure uniform and efficient moisture distribution in the soil. The use of a tube for watering poses challenges in achieving consistent soil wetting. By adopting bottom watering, we mitigate the risk of overwatering, promote the development of robust root systems, and encourage even root distribution in the soil. This method minimizes the potential for plant pests and fungal diseases. The brief retention of moisture in the soil allows plants to absorb precisely the amount of water they need, fostering healthy growth while preventing issues associated with water excess. The strategic placement of the watering tube in our project reflects our commitment to optimizing plant health through intelligent irrigation practices.
![](/images/Bottom-Watering.jpg)

### Blog Post

- [Blog Post](https://www.hackster.io/gavrieldnp/smart-plant-abd308)

### Video

- [Video Presentation]()
