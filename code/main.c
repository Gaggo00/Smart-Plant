#include "stdio.h"
#include "stdlib.h"
#include "xtimer.h"
#include "periph/pwm.h"
#include "paho_mqtt.h"
#include "MQTTClient.h"
#include "periph/adc.h"
#include <math.h>

//MQTT settings
#define BUF_SIZE 1024

#define MQTT_VERSION_v311               4       /* MQTT v3.1.1 version is 4 */
#define COMMAND_TIMEOUT_MS              5000

#define BROKER_ADDRESS "192.168.1.126"
#define DEFAULT_MQTT_PORT               1883
#define DEFAULT_KEEPALIVE_SEC           15
#define TOPIC "smartPlant"

#define IS_CLEAN_SESSION                1
#define IS_RETAINED_MSG                 0


static MQTTClient client;
static Network network;
static unsigned char buf[BUF_SIZE];
static unsigned char readbuf[BUF_SIZE];

#define ADC_RES     ADC_RES_12BIT
//Water Level
uint_fast8_t water_level_sensor = ADC_LINE(0); // Pin 36

//Water pump
#define GPIO_LINE  GPIO_PIN(0,22) //Pin 22

//Humidity
uint_fast8_t humidity_sensor = ADC_LINE(1); // Pin 39

#define THRESHOLD_HUMIDITY 1500
#define MAX_HUMIDITY 2000
#define WATER_ABSORPTION_TIME 1200
#define SOIL_DRYING_TIME 115200

int pumpWater(gpio_t line, uint32_t seconds){
    gpio_clear(line);

    xtimer_sleep(seconds);

    gpio_set(line);

    return 0;
}

int mqtt_init(void){

    xtimer_sleep(5);

    NetworkInit(&network);
    MQTTClientInit(&client, &network, COMMAND_TIMEOUT_MS, buf, BUF_SIZE, readbuf, BUF_SIZE);
    MQTTStartTask(&client);

    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;
    data.MQTTVersion = MQTT_VERSION_v311;
    data.clientID.cstring = "";
    data.username.cstring = "";
    data.password.cstring = "";
    data.keepAliveInterval = 60;
    data.cleansession = 1;

    printf("MQTT: Connecting to MQTT Broker from %s %d\n",
            BROKER_ADDRESS, DEFAULT_MQTT_PORT);
    printf("MQTT: Trying to connect to %s, port: %d\n",
            BROKER_ADDRESS, DEFAULT_MQTT_PORT);
    
    int res = NetworkConnect(&network, BROKER_ADDRESS, DEFAULT_MQTT_PORT);

    if(res){
        printf("MQTT unable to connect: Error %d\n", res);
        return res;
    }
    printf("user:%s clientId:%s password:%s\n", data.username.cstring,
             data.clientID.cstring, data.password.cstring);
    res = MQTTConnect(&client, &data);

    if (res < 0) {
        printf("MQTT: Unable to connect client %d\n", res);
        int res = MQTTDisconnect(&client);
        if (res < 0) {
            printf("MQTT: Unable to disconnect\n");
        }
        else {
            printf("MQTT: Disconnect successful\n");
        }
        NetworkDisconnect(&network);
        return res;
    }
    else{
        printf("MQTT: Connection success!\n");
    }

    printf("MQTT client succesfully connected to the broker\n");
    return 0;
}


int initialize_sensors_and_actuators(void){
    
    if(gpio_init(GPIO_LINE,GPIO_OD) == 0){
        printf("GPIO line %u initialization succesful\n",GPIO_LINE);
    }else{
        printf("Error initializing %u GPIO line\n",GPIO_LINE);
    }
    gpio_set(GPIO_LINE);
    
    if (adc_init(ADC_LINE(0)) < 0)
        puts("humidity sensor initialization failed\n");
    
    if(adc_init(ADC_LINE(1))< 0)
        puts("water level sensor initialization failed\n");

    return 0;
}
int adc_to_ml(int value){
    return floor(0.89*value + 632);
}

int main(void) {
    
     if (mqtt_init()){
        printf("MQTT initialization error...!\n");
    }else printf("MQTT initialization success\n");
    
    initialize_sensors_and_actuators();

    int i=0;
    /* Measure Values*/
    //int humidity = adc_sample(ADC_LINE(0), ADC_RES);
    //int water_level= adc_sample(ADC_LINE(1), ADC_RES);
    int humidity = 1432;
    int water_level=400;
    while (1) {
        //humidity = adc_sample(ADC_LINE(0), ADC_RES);
        
        if(humidity < THRESHOLD_HUMIDITY){
            pumpWater(GPIO_LINE, 10);
            //water_level= adc_sample(ADC_LINE(1), ADC_RES);
        }
        int water_level_ml = adc_to_ml(water_level);
        /* Publish a message on the topic*/

        
        char json[256];

        sprintf(json, "{\"id\": \"%d\", \"Humidity\": \"%d\", \"Water_level\": \"%d\"}", i, humidity, water_level_ml);

        char* msg = json;

        //MQTT publish
        MQTTMessage message;
        message.qos = QOS1;
        message.retained = IS_RETAINED_MSG;
        message.payload = msg;
        message.payloadlen = strlen(message.payload);

        int rp = MQTTPublish(&client, TOPIC, &message);
        if (rp){
            printf("MQTT error %d: unable to publish!\n", rp);
        }else{
            printf("MQTT message published succesfully to topic %s\n", TOPIC);
        }

        
        
        if(humidity < THRESHOLD_HUMIDITY){
            xtimer_sleep(WATER_ABSORPTION_TIME);
        }
        else{
            xtimer_sleep(SOIL_DRYING_TIME* humidity/MAX_HUMIDITY);
        }
        i++;        
    }

    return 0;
}
