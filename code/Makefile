# name of your application
APPLICATION = smart_plant

# If no BOARD is found in the environment, use this default:
BOARD ?= native

# This has to be the absolute path to the RIOT base directory:
RIOTBASE ?= $(CURDIR)/../..

# Comment this out to disable code in RIOT that does safety checking
# which is not needed in a production environment but helps in the
# development process:
DEVELHELP ?= 1

# Change this to 0 show compiler invocation lines by default:
QUIET ?= 1

WIFI_SSID ?= ""
WIFI_PASS ?= ""

ifneq (,$(DEFAULT_MQTT_CLIENT_ID))
  CFLAGS += -DDEFAULT_MQTT_CLIENT_ID=\"$(DEFAULT_MQTT_CLIENT_ID)\"
endif
ifneq (,$(DEFAULT_MQTT_USER))
  CFLAGS += -DDEFAULT_MQTT_USER=\"$(DEFAULT_MQTT_USER)\"
endif
ifneq (,$(DEFAULT_MQTT_PWD))
  CFLAGS += -DDEFAULT_MQTT_PWD=\"$(DEFAULT_MQTT_PWD)\"
endif



USEMODULE += xtimer
USEMODULE += analog_util
USEMODULE += netdev_default
#FMT module convert values from the sensor as 16-bit fixed 
#point numbers into a decimal string
USEMODULE += fmt
USEPKG += paho-mqtt

#USEMODULE += periph_pwm
FEATURES_REQUIRED += periph_adc

# paho-mqtt depends on TCP support, choose which stacks you want
LWIP_IPV4 ?= 1

include Makefile.lwip

USEMODULE += sock_async_event
USEMODULE += sock_ip
USEMODULE += sock_udp
USEMODULE += sock_tcp

USEMODULE += ztimer

USEMODULE += servo
USEMODULE += servo_pwm
USEMODULE += srf04

####

include $(RIOTBASE)/Makefile.include

ifneq (,$(filter arch_esp,$(FEATURES_USED)))
  CFLAGS += -DWIFI_SSID=\"$(WIFI_SSID)\"
  CFLAGS += -DWIFI_PASS=\"$(WIFI_PASS)\"
endif
