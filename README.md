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
### Circuit Diagram
![](/images/Circuit diagram.png)

### AWS ecosystem
The details collected by the two sensors are sent to the AWS system, allowing us to continuously monitor the plant's status. AWS IoT Core ensures secure communication between the ESP32 board and the cloud, where the information is securely stored in Amazon DynamoDB. Real-time data processing is carried out by AWS Lambda functions. Amazon API Gateway provides a secure website for users to monitor and control the system, and AWS Amplify simplifies the creation of a user-friendly app. All in all, these services ensure a seamless connection for the smart Plant project, enabling real-time data analysis, access control, and an improved user experience.
![](/images/network_architecture.jpg)

### Sample period: 
**How often should the humidity be measured?** The plant's humidity will be measured using a linear function based on the average time it takes for the plant to return to a dry state given its optimal condition. If the plant is below a certain threshold, it will be watered from below, and after 20 minutes, the time needed for the plant to absorb water, a new measurement will be taken.

**How often should the water level be measured?** The frequency of measuring the water level is tied to the plant's irrigation cycle. Given that the water level primarily changes when we irrigate the plant, measurements are scheduled immediately after each irrigation event.

### Irrigation: Optimal Growth with Bottom Watering
In the Smart Plant system, we prioritize bottom watering to ensure a consistent and efficient distribution of moisture in the soil. Using a tube for watering presents challenges in achieving uniform soil wetting. By adopting bottom watering, we address the risk of overwatering, promote the development of robust root systems, and encourage even root distribution in the soil. This method minimizes the potential for plant pests and fungal diseases. The brief retention of moisture in the soil allows plants to absorb precisely the amount of water they need, fostering healthy growth while preventing issues associated with excess water. The strategic placement of the watering tube in the project also reflects the impossibility of uniformly irrigating the plant from above.

![](/images/Bottom-Watering.jpg)

## Guide
#### Step 1: Download and Install RIOT OS from Github
- Follow the instructions provided [HERE](https://github.com/RIOT-OS/RIOT) to download and install the RIOT OS repository.
#### Step 2: Create a New RIOT Application
- Create a new folder named "SmartPlant" in the "examples" directory of your RIOT repository.
- Copy the files from the "code" folder on this page into the newly created folder.
#### Step 3: Install and Configure Mosquitto
- Download and install the Mosquitto MQTT-Broker following the instructions at [this link](https://mosquitto.org/download/).
- Go to the Mosquitto installation folder (on Ubuntu, it might be "etc/mosquitto/") and create a new file called "_mosquitto.conf_". Paste the following lines into it:
   - _allow_anonymous true_ 
    - _listener 1883_ 

#### Step 4: Connect to AWS
##### 4.1 IoT Core
- Create an AWS account if you don't already have one.
- Connect a new thing following the instructions given by AWS and download the SDK package to your PC.
- In the "Things" section, click on your thing, then go to the "Certificates" section. Connect the policy under the SDK folder downloaded in the previous step and edit the active version as follows (your_ARN should look like this: "_arn:aws:iot:eu-west-3:101249212265_"):
  - "_your_ARN:thing/smartPlant_" 
  - "_your_ARN:topic/smartPlant/data_" 
  - "_your_ARN:topicfilter/smartPlant_" 
  - "_your_ARN:topicfilter/smartPlant/data_"
  - "_your_ARN:client/ESP32_" 
 
- In the message routing section, go to Rules to create a new rule called "_smartPlant_" and click on the next button.
- _SELECT * FROM smartPlant/data_
- Choose DynamoDBv2 and create a new table called "smartPlantTable" with "timestamp" as the partition key attribute.
- Go back to the rule settings, select the just created table, and create a new IAM role "user", then select it.
- Complete the rule creation.
##### 4.2 Lambda
- Create a new Python Lambda function, name it "getSmartPlantData" and paste the code of the same-named Python script included in this repository.
- Save changes and deploy your function.
- Now you must give the lambda function permission to access a DynamoDB table. To do this, search "IAM" in the AWS search bar, then go into the "Policy" settings and search for "dynamoDB". Click on the first result (It should be something like "amazonDynamoDBFullAccess"), and then in the "Entities attached" section click on "Attach" to attach the policy to your lambda function.
##### 4.3 API Gateway
- Create a new REST API called "smartPlantAPI".
- Click on "Options" in the resource section and create a new "GET" method.
- Make sure to paste the ARN of your lambda function where requested.
- Under the options, click on "Enable CORS" and enable it.
- Finally, click on deploy API, select "New phase" and call it "dev". Now you obtained the URL of the API needed in the web app JavaScript file.
##### 4.4 Amplify
- Create a new App and call it "smartPlantAPP".
- Choose the option to implement without a git provider.
- Rename the environment to "dev" and drag and drop the folder of the web application of the project.

### How to Run the Code
1. Go into the RIOT application folder:
- In the Makefile: Change the Wi-Fi parameters to the ones that you want to use.
- In the main.c file: Change the BROKER_ADDRESS with your IPv4 IP address.
2. Run Mosquitto from its root directory with the command:

$ _mosquitto -v -c mosquitto.conf_ 
- Go into the Python transparent bridge provided in this repo:
- Change the BROKER_ADDRESS variable value to yours.
- Change the three paths of root-CA, private-key, and certificate.pem to yours.
- Change the value of the AWS endpoint variable to yours.
3. Start the bridge with:
  
$ _python3 MQTTClient_transparentBridge_

4. Flash the firmware onto your ESP32 board using the following command:

$ _sudo BOARD=esp32s3-heltec-lora32-v2 BUILD_IN_DOCKER=1 DOCKER="sudo docker" PORT=/dev/ttyUSB0 make flash term_

(check the name of your USB it could be different from "ttyUSB0")

- In the JavaScript file of the web application, make sure to change the URL passed in the "callAPI()" function to the one corresponding to your API endpoint.
- Now everything should work, and you should start to see the real data updates in the web dashboard. You can see this process in more detail by watching the YouTube video demonstration of the project.



### Blog Post

- [Blog Post](https://www.hackster.io/gavrieldnp/smart-plant-abd308)

### Video

- [Video Presentation](https://youtu.be/y7Vcms6Gt4k)
### Linkedin
- [Linkedin profile](https://it.linkedin.com/in/gavriel-di-nepi-544a971b1?trk=public_profile_browsemap_profile-result-card_result-card_full-click)
